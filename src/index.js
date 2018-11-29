const {synch} = require('./syncher');
const SplitPrinter = require('./print/SplitPrinter');

let dwytpl = (downloadDir, playlistId, parallelDownloadCount = 10, print) => {
    let tracker = synch(downloadDir, playlistId, parallelDownloadCount);

    if (print) {
        let splitPrinter = new SplitPrinter(3, parallelDownloadCount, 30);

        tracker.title.each(titleLines =>
            splitPrinter.titleLines = titleLines);
        tracker.summary.each(summaryLines =>
            splitPrinter.summaryLines = summaryLines);
        tracker.progerss.each(progerssLines =>
            splitPrinter.progerssLines = progerssLines);
        tracker.messages.each(messagesLines =>
            splitPrinter.messagesLines = messagesLines);
    }

    return tracker;
};

module.exports = dwytpl;
