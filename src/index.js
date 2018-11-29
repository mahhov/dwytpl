const {synch} = require('./syncher');
const SplitPrinter = require('./print/SplitPrinter');

let dwytpl = (downloadDir, playlistId, parallelDownloadCount = 10, print) => {
    let tracker = synch(downloadDir, playlistId, parallelDownloadCount);

    if (print) {
        let splitPrinter = new SplitPrinter(1, 2, parallelDownloadCount, 30);

        tracker.title.each(titleLines =>
            splitPrinter.titleLines = titleLines);
        tracker.summary.each(summaryLines =>
            splitPrinter.summaryLines = summaryLines);
        tracker.progerss.each(progressLines =>
            splitPrinter.progressLines = progressLines);
        tracker.messages.each(messageLines =>
            splitPrinter.messageLines = messageLines);
    }

    return tracker;
};

module.exports = dwytpl;
