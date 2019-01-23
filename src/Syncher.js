const $tream = require('bs-better-stream');
const Summary = require('./Summary');
const FileWalker = require('file-walk-stream');
const ProgressTracker = require('./ProgressTracker');

class Syncher {
    constructor(playlist) {
        this.progressTracker_ = new ProgressTracker();
        this.summary_ = new Summary();
        this.tracker = {
            title: $tream()
                .writePromise(playlist.getOverview())
                .map(({title, length}) => [`${title} [${length}]`]),
            summary: this.summary_.stream,
            progerss: this.progressTracker_.progressStream,
            messages: this.progressTracker_.messageStream,
        };

        playlist.getOverview().then(({length}) =>
            this.summary_.setTotal(length));

        this.videos_ = playlist.getVideos();
    }

    async setDownloadDir(downloadDir = this.downloadDir_) {
        this.downloadDir_ = downloadDir;
        this.files_ = FileWalker.walk(downloadDir);

        await this.files_.complete;

        this.videos_.productX(this.files_, (video, {file}) => video.isSame(file), video => video.downloaded = true);
        this.downloaded_ = this.videos_.if(video => video.downloaded);
        this.downloaded_.then.each(() => this.summary_.incrementPredownloaded());
    }

    async download(parallelDownloadCount = 10) {
        if (!this.downloadDir_)
            throw 'invoke .setDownloadDir_(string downloadDir) before invoking .synch(int parallelDownloadCount = 10)';

        await this.files_.complete;

        this.summary_.onStart();

        let toDownload = this.downloaded_.else.throttle(parallelDownloadCount);
        toDownload.stream
            .map(video => video.download(this.downloadDir_))
            .set('index', (_, i) => i)
            .each(({stream, index}) => stream.each(text => this.progressTracker_.setProgressLine(index, text)))
            .waitOn('promise')
            .each(toDownload.nextOne)
            .filterEach(status => status.promise && status.promise.isRejected,
                () => this.summary_.incrementFailed(),
                () => this.summary_.incrementDownloaded())
            .each(({index}) => this.progressTracker_.removeProgressLine(index));
    }

    stopDownload() {
        this.downloaded_.else.disconnect();
        this.setDownloadDir();
    }
}

module.exports = Syncher;
