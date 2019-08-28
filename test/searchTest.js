const path = require('path');
const dwytpl = require('../src/index');
let downloadDir = path.resolve(__dirname, '../downloads');
let downloadDir2 = path.resolve(__dirname, '../downloads2');

let search = new dwytpl.Search();
search.query('jon bovi');
let syncher = new dwytpl.Syncher(search);
syncher.setDownloadDir(downloadDir2, [downloadDir], true);
// search.query('hardwell');
syncher.download();

let tracker = syncher.tracker;

// tracker.title.each(([title]) =>
//     console.log('new title:', title));
// tracker.summary.each(lines => {
//     console.log('new summary:');
//     lines.forEach(line => console.log(line));
// });
// // tracker.progress.each(lines => {
// //     console.log('new progress:');
// //     lines.forEach(line => console.log(line));
// // });
// tracker.messages.each(lines => {
//     console.log('new messages:');
//     lines.forEach(line => console.log(line));
// });

search.getVideos()
    .map(video => video.status)
    .each((videoStatus, i) => videoStatus.stream
        .filter((_, j) => j <= 1 || videoStatus.promise.done)
        .each((value, j) =>
            console.log(
                i,
                j,
                value,
                videoStatus.downloaded,
                videoStatus.failed,
                videoStatus.downloadDirs)));
