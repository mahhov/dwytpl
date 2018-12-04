const path = require('path');
const dwytpl = require('../src/index');

let playlist = new dwytpl.Playlist('OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw');
let tracker = dwytpl(path.resolve(__dirname, '../downloads'), playlist, 10);

let splitPrinter = new dwytpl.SplitPrinter(1, 2, 10, 30);

tracker.title.each(titleLines =>
    splitPrinter.titleLines = titleLines);
tracker.summary.each(summaryLines =>
    splitPrinter.summaryLines = summaryLines);
tracker.progerss.each(progressLines =>
    splitPrinter.progressLines = progressLines);
tracker.messages.each(messageLines =>
    splitPrinter.messageLines = messageLines);
