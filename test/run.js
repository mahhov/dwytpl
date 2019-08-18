const path = require('path');
const dwytpl = require('../src/index');

let playlist = new dwytpl.Playlist('PLameShrvoeYe8zDrjPzMPe6PKkRxXJqAm');
let syncher = new dwytpl.Syncher(playlist);
let tracker = syncher.tracker;
let downloadDir = path.resolve(__dirname, '../downloads');

syncher.setDownloadDir(downloadDir);
syncher.download();

let splitPrinter = new dwytpl.SplitPrinter(1, 2, 10, 30);

tracker.title.each(titleLines =>
    splitPrinter.titleLines = titleLines);
tracker.summary.each(summaryLines =>
    splitPrinter.summaryLines = summaryLines);
tracker.progress.each(progressLines =>
    splitPrinter.progressLines = progressLines);
tracker.messages.each(messageLines =>
    splitPrinter.messageLines = messageLines);
