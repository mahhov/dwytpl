const $tream = require('bs-better-stream');
const Summary = require('./Summary');
const FileWalker = require('file-walk-stream');
const ProgressTracker = require('./ProgressTracker');

class Synchable {
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
            progerss: this.progressTracker_.progressStream,
            messages: this.progressTracker_.messageStream,
            videoStatuses: this.videos_.map(video => video.status),
        };
        synchable.getOverview().then(({length}) =>
            this.summary_.setTotal(length));
    }

    async setDownloadDir(downloadDir = this.downloadDir_) {
        this.downloadDir_ = downloadDir;
        this.files_ = FileWalker.walk(downloadDir);

        await this.files_.complete;

        this.videos_
            .productX(this.files_,
                (video, {file}) => video.isSame(file),
                video => video.status.onSuccess(downloadDir));
        this.videos_
            .filter(video => video.status.downloaded)
            .each(() => this.summary_.incrementPredownloaded());
    }

    async download(parallelDownloadCount = 10) {
        if (!this.downloadDir_)
            throw 'invoke .setDownloadDir_(string downloadDir) before invoking .synch(int parallelDownloadCount = 10)';

        await this.files_.complete;

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
            .filterEach(status => status.promise && status.promise.isRejected,
                () => this.summary_.incrementFailed(),
                () => this.summary_.incrementDownloaded())
            .each(({index_}) => this.progressTracker_.removeProgressLine(index_));
    }

    stopDownload() {
        this.videos_.each(video => video.stopDownload());
        this.setDownloadDir();
    }
}

Syncher.Synchable = Synchable;

module.exports = Syncher;
