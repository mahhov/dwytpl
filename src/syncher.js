const AccumulatePrinter = require('./print/AccumulatePrinter');
const Summary = require('./Summary');
const FileWalker = require('file-walk-stream');
const Playlist = require('./Playlist');

let sync = async (downloadDir, playlistId, parallelDowndloadCount = 10) => {
    let printer = new AccumulatePrinter(3, parallelDowndloadCount, 30);

    let summary = new Summary();
    summary.stream.each(([line1, line2]) => {
        printer.setTitleLine(1, line1);
        printer.setTitleLine(2, line2);
    });

    let files = FileWalker.walk(downloadDir);

    let playlist = new Playlist(playlistId);
    playlist.getOverview().then(({title, length}) => {
        printer.setTitleLine(0, `${title} [${length}]`);
        summary.setTotal(length);
    });
    let videos = playlist.getVideos();

    await files.complete;

    summary.onStart();

    videos.productX(files, (video, {file}) => video.isSame(file), video => video.downloaded = true);
    let downloaded = videos
        .if(video => video.downloaded);

    downloaded.then.each(() => summary.incrementPredownloaded());

    let toDownload = downloaded.else.throttle(parallelDowndloadCount);
    toDownload.stream
        .map(video => video.download(downloadDir))
        .set('index', (_, i) => i)
        .each(({stream, index}) => stream.each(text => printer.setProgressLine(index, text)))
        .waitOn('promise')
        .each(toDownload.nextOne)
        .filterEach(status => status.promise && status.promise.isRejected,
            () => summary.incrementFailed(),
            () => summary.incrementDownloaded())
        .each(({index}) => printer.removeProgressLine(index))
};

module.exports = {sync};
