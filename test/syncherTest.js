const dwytpl = require('../src/index');

const path = './downloads';
const playlistId = 'OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw';

let playlist = new dwytpl.Playlist(playlistId);
let syncher = new dwytpl.Syncher(playlist, path);

syncher.download();

let splitPrinter = new dwytpl.SplitPrinter(1, 2, 10, 30);

// tracker.title.each(titleLines =>
//     splitPrinter.titleLines = titleLines);
// tracker.summary.each(summaryLines =>
//     splitPrinter.summaryLines = summaryLines);
// tracker.progress.each(progressLines =>
//     splitPrinter.progressLines = progressLines);
// tracker.messages.each(messageLines =>
//     splitPrinter.messageLines = messageLines);
