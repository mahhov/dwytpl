const path = require('path');
const dwytpl = require('../src/index');

let downloadDir = path.resolve(__dirname, '../downloads');
let videoList = new dwytpl.VideoList();
let syncher = new dwytpl.Syncher(videoList, downloadDir);

let splitPrinter = new dwytpl.SplitPrinter(1, 2, 10, 10);
syncher.tracker.title.each(titleLines =>
    splitPrinter.titleLines = titleLines);
syncher.tracker.summary.each(summaryLines =>
    splitPrinter.summaryLines = summaryLines);
syncher.tracker.progress.each(progressLines =>
    splitPrinter.progressLines = progressLines);
syncher.tracker.messages.each(messageLines =>
    splitPrinter.messageLines = messageLines);

syncher.download(10, {filter: format => format.itag === 251});

videoList.add('iWRolPgp9JY'); // 4 mb without video
videoList.add('QvtjAoFBmVg\n'); // 62 mb with highestaudio, 3mb with audioonly & highestaudio
