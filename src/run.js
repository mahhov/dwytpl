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
    let videos = playlist.getVideos().throttle(PARALLEL_DOWNLOAD_COUNT);

    await files;

    summary.onStart();

    videos.stream
        .productX(files, (video, file) => video.isSame(file.file), video => video.downloaded = true);
    let downloaded = videos.stream
        .if(video => video.downloaded);

    downloaded.then
        .each(videos.nextOne)
        .each(() => summary.incrementPredownloaded);

    downloaded.else
        .map(video => video.download())
        .set('index', (_, i) => i)
        .each(({stream, index}) => stream.each(text => printer.setProgressLine(index, text)))
        .set('promise.promise', status => status.promise.promise)
        .waitOn('promise.promise')
        .each(videos.nextOne)
        .each(() => summary.incrementDownloaded())
        .each(({index}) => printer.removeProgressLine(index))
})();

// todo
// count and display errors. errors should trigger throttle.next
// color output to show status
// why error when no exist downloads dir
