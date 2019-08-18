const path = require('path');
const dwytpl = require('../src/index');
let downloadDir = path.resolve(__dirname, '../downloads');

let search = new dwytpl.Search();
search.query('jon bovi');
let syncher = new dwytpl.Syncher(search);
syncher.setDownloadDir(downloadDir);
// search.query('hardwell');
syncher.download();

let tracker = syncher.tracker;

// tracker.title.each(([title]) =>
//     console.log('new title:', title));
// tracker.summary.each(lines => {
//     console.log('new summary:');
//     lines.forEach(line => console.log(line));
// });
// // tracker.progerss.each(lines => {
// //     console.log('new progerss:');
// //     lines.forEach(line => console.log(line));
// // });
// tracker.messages.each(lines => {
//     console.log('new messages:');
//     lines.forEach(line => console.log(line));
// });

search.getVideos()
    .map(video => video.status)
    .each((videoStatus, i) => videoStatus.stream.each((value, j) =>
        console.log(
            i,
            j,
            value,
            videoStatus.downloaded,
            videoStatus.failed,
            videoStatus.promise,
            videoStatus.downloadDir)));
