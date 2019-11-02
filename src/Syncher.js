const fs = require('fs').promises;
const $tream = require('bs-better-stream');
const Summary = require('./Summary');
const ProgressTracker = require('./ProgressTracker');
const Video = require('./Video');

class Synchable {
    // todo deprecated
    async getOverview() {
        return {title: '', length: 0};
    }

    get videos() {
        return this.videos_ || $tream();
    }
}

class Syncher {
    constructor(synchable, downloadDir, alternateDirs = [], moveFromAlternativeDirs = false) {
        this.videos_ = synchable.videos;
        this.progressTracker_ = new ProgressTracker();
        this.summary_ = new Summary();
        this.tracker = {
            title: $tream()
                .writePromise(synchable.getOverview())
                .map(({title, length}) => [`${title} [${length}]`]),
            summary: this.summary_.stream,
            progress: this.progressTracker_.progressStream,
            messages: this.progressTracker_.messageStream,
        };
        this.videos_.each((_, i) => this.summary_.setTotal(i + 1));
        this.setDownloadDir_(downloadDir, alternateDirs, moveFromAlternativeDirs);
    }

    async setDownloadDir_(downloadDir, alternateDirs, moveFromAlternativeDirs) {
        this.downloadDir_ = downloadDir;
        this.dirs_ = $tream().write(downloadDir, ...alternateDirs);
        this.moveFromAlternativeDirs_ = moveFromAlternativeDirs;
        return this.recheckDirsPromise_ = this.recheckDirs_();
    }

    async recheckDirs_() {
        let files = this.dirs_
            .map(dir => ({dir, files: fs.readdir(dir)}))
            .waitOn('files')
            .flattenOn('files', 'file');

        this.videos_
            .productX(files,
                (video, {file}) => video.id_ === Video.idFromFileName(file),
                (video, {dir, file}) => video.status.onSuccess(dir, file));
        this.videos_
            .filter(video => video.status.downloaded)
            .each(() => this.summary_.incrementPredownloaded())
            .filter(() => this.moveFromAlternativeDirs_)
            .each(video => video.move(this.downloadDir_));
    }

    async download(parallelDownloadCount = 10, audioOnly = true) {
        if (!this.downloadDir_)
            throw 'invoke .setDownloadDir_(string downloadDir) before invoking .synch(int parallelDownloadCount = 10)';

        await this.recheckDirsPromise_;

        this.summary_.onStart();

        let toDownload = this.videos_
            .filter(video => !video.status.downloaded)
            .throttle(parallelDownloadCount);
        toDownload.stream
            .set('index_', (_, i) => i)
            .each(video => video.download(this.downloadDir_, audioOnly))
            .each(video => video.status.stream.each(text =>
                this.progressTracker_.setProgressLine(video.index_, ProgressTracker.padText(video.numberedFileName) + text)))
            .map(video => video.status.promise.then(() => video, () => video))
            .wait()
            .each(toDownload.nextOne)
            .filterEach(({status}) => status.downloaded,
                () => this.summary_.incrementDownloaded(),
                () => this.summary_.incrementFailed())
            .each(({index_}) => this.progressTracker_.removeProgressLine(index_));
    }

    stopDownload(toBeReused = false) {
        this.videos_.each(video => video.stopDownload());
        if (toBeReused)
            return this.recheckDirs_();
    }
}

Syncher.Synchable = Synchable;

module.exports = Syncher;
