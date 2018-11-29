const Summary = require('./Summary');
const FileWalker = require('file-walk-stream');
const Playlist = require('./Playlist');
const ProgressTracker = require('./ProgressTracker');

let synch = async (downloadDir, playlistId, parallelDownloadCount) => {
    let progressTracker = new ProgressTracker();

    let summary = new Summary();

    let files = FileWalker.walk(downloadDir);

    let playlist = new Playlist(playlistId);
    playlist.getOverview().then(({length}) =>
        summary.setTotal(length));
    let videos = playlist.getVideos();

    await files.complete;

    summary.onStart();

    videos.productX(files, (video, {file}) => video.isSame(file), video => video.downloaded = true);
    let downloaded = videos
        .if(video => video.downloaded);

    downloaded.then.each(() => summary.incrementPredownloaded());

    let toDownload = downloaded.else.throttle(parallelDownloadCount);
    toDownload.stream
        .map(video => video.download(downloadDir))
        .set('index', (_, i) => i)
        .each(({stream, index}) => stream.each(text => progressTracker.setProgressLine(index, text)))
        .waitOn('promise')
        .each(toDownload.nextOne)
        .filterEach(status => status.promise && status.promise.isRejected,
            () => summary.incrementFailed(),
            () => summary.incrementDownloaded())
        .each(({index}) => progressTracker.removeProgressLine(index));

    return {
        title: $tream()
            .writePromise(playlist.getOverview())
            .map(({title, length}) => [`${title} [${length}]`]),
        summary: summary.stream,
        progerss: progressTracker.progressStream,
        messages: progressTracker.messageStream,
    }
};

module.exports = {synch};
