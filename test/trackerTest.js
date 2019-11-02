const path = require('path');
const dwytpl = require('../src/index');

let playlist = new dwytpl.Playlist('OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw');
let downloadDir = path.resolve(__dirname, '../downloads');
let syncher = new dwytpl.Syncher(playlist, downloadDir);
let tracker = syncher.tracker;
syncher.download();

tracker.title.each(([title]) =>
    console.log('new title:', title));
tracker.summary.each(lines => {
    console.log('new summary:');
    lines.forEach(line => console.log(line));
});
tracker.progress.each(lines => {
    console.log('new progress:');
    lines.forEach(line => console.log(line));
});
tracker.messages.each(lines => {
    console.log('new messages:');
    lines.forEach(line => console.log(line));
});
