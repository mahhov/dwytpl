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

    async download(downloadDir, parallelDownloadCount = 10) {
        let files = FileWalker.walk(downloadDir);

        await files.complete;

        this.summary_.onStart();

        this.videos_.productX(files, (video, {file}) => video.isSame(file), video => video.downloaded = true);
        let downloaded = this.videos_
            .if(video => video.downloaded);

        downloaded.then.each(() => this.summary_.incrementPredownloaded());

        let toDownload = downloaded.else.throttle(parallelDownloadCount);
        toDownload.stream
            .map(video => video.download(downloadDir))
            .set('index', (_, i) => i)
            .each(({stream, index}) => stream.each(text => this.progressTracker_.setProgressLine(index, text)))
            .waitOn('promise')
            .each(toDownload.nextOne)
            .filterEach(status => status.promise && status.promise.isRejected,
                () => this.summary_.incrementFailed(),
                () => this.summary_.incrementDownloaded())
            .each(({index}) => this.progressTracker_.removeProgressLine(index));
    }
}

module.exports = Syncher;
