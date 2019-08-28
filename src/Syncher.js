const $tream = require('bs-better-stream');
const Summary = require('./Summary');
const FileWalker = require('file-walk-stream');
const ProgressTracker = require('./ProgressTracker');

class Synchable {
    // todo deprecated
    async getOverview() {
        return {title: '', length: 0};
    }

    getVideos() {
        return $tream();
    }
}

class Syncher {
    constructor(synchable) {
        this.videos_ = synchable.getVideos();
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
        synchable.getVideos().each((_, i) => this.summary_.setTotal(i + 1));
    }

    async setDownloadDir(downloadDir, alternateDirs = [], moveFromAlternativeDirs = false) {
        this.downloadDir_ = downloadDir;
        this.dirs_ = $tream().write(downloadDir, ...alternateDirs);
        this.moveFromAlternativeDirs_ = moveFromAlternativeDirs;
        return this.recheckDirsPromise_ = this.recheckDirs_();
    }

    async recheckDirs_() {
        let walks = this.dirs_
            .map(dir => FileWalker.walk(dir));
        await walks.map(walk => walk.complete).promise;
        this.files_ = walks
            .flatMap(walk => walk.outValues);

        this.videos_
            .productX(this.files_,
                (video, {file}) => video.isSame(file),
                (video, {dir}) => video.status.onSuccess(dir));
        this.videos_
            .filter(video => video.status.downloaded)
            .each(() => this.summary_.incrementPredownloaded())
            .filter(() => this.moveFromAlternativeDirs_)
            .each(video => video.move(this.downloadDir_));
    }

    async download(parallelDownloadCount = 10) {
        if (!this.downloadDir_)
            throw 'invoke .setDownloadDir_(string downloadDir) before invoking .synch(int parallelDownloadCount = 10)';

        await this.recheckDirsPromise_;

        this.summary_.onStart();

        let toDownload = this.videos_
            .filter(video => !video.status.downloaded)
            .throttle(parallelDownloadCount);
        toDownload.stream
            .each(video => video.download(this.downloadDir_))
            .map(video => video.status)
            .set('index_', (_, i) => i)
            .each(({stream, index_}) => stream.each(text => this.progressTracker_.setProgressLine(index_, text)))
            .waitOn('promise')
            .each(toDownload.nextOne)
            .filterEach(status => status.downloaded,
                () => this.summary_.incrementDownloaded(),
                () => this.summary_.incrementFailed())
            .each(({index_}) => this.progressTracker_.removeProgressLine(index_));
    }

    stopDownload() {
        this.videos_.each(video => video.stopDownload());
        return this.recheckDirs_();
    }
}

Syncher.Synchable = Synchable;

module.exports = Syncher;
