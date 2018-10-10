#!/usr/bin/env node

const SplitPrinter = require('./SplitPrinter');
const Summary = require('./Summary');
const file = require('./file');
const Playlist = require('./Playlist');

const id = 'PLameShrvoeYfp54xeNPK1fGxd2a7IzqU2';
const PARALLEL_DOWNLOAD_COUNT = 10;

(async () => {
    let printer = new SplitPrinter(3, PARALLEL_DOWNLOAD_COUNT, 30);

    let summary = new Summary();
    summary.stream.each(([line1, line2]) => {
        printer.setTitleLine(1, line1);
        printer.setTitleLine(2, line2);
    });

    let files = file.getFiles();

    let playlist = new Playlist(id);
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

    let toDownload = downloaded.else.throttle(PARALLEL_DOWNLOAD_COUNT);
    toDownload.stream
        .map(video => video.download())
        .set('index', (_, i) => i)
        .each(({stream, index}) => stream.each(text => printer.setProgressLine(index, text)))
        .waitOn('promise')
        .each(toDownload.nextOne)
        .filterEach(status => status.promise && status.promise.isRejected,
            () => summary.incrementFailed(),
            () => summary.incrementDownloaded())
        .each(({index}) => printer.removeProgressLine(index))
})();

// todo
// color output to show status
