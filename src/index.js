const {synch} = require('./syncher');
const AccumulatePrinter = require('./print/AccumulatePrinter');
const SplitPrinter = require('./print/SplitPrinter');

let dwytpl = (downloadDir, playlistId, parallelDownloadCount = 10, print) => {
    let printer = print ? new SplitPrinter(3, parallelDownloadCount, 30) : new AccumulatePrinter(3, parallelDownloadCount, 30);
    synch(downloadDir, playlistId, printer, parallelDownloadCount);
    return printer;
};

module.exports = dwytpl;
