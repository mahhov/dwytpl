const path = require('path');
const dwytpl = require('../src/index');

let playlist = new dwytpl.Playlist('OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw');
let syncher = new dwytpl.Syncher(playlist);
let tracker = syncher.tracker;
let downloadDir = path.resolve(__dirname, '../downloads');

syncher.setDownloadDir(downloadDir);
sumcher.download();

tracker.title.each(([title]) =>
    console.log('new title:', title));
tracker.summary.each(lines => {
    console.log('new summary:');
    lines.forEach(line => console.log(line));
});
tracker.progerss.each(lines => {
    console.log('new progerss:');
    lines.forEach(line => console.log(line));
});
tracker.messages.each(lines => {
    console.log('new messages:');
    lines.forEach(line => console.log(line));
});
