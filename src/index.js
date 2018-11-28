const {synch} = require('./syncher');
const AccumulatePrinter = require('./print/AccumulatePrinter');
const SplitPrinter = require('./print/SplitPrinter');

let dwytpl = (downloadDir, playlistId, parallelDowndloadCount = 10, print) => {
    let printer = print ? new SplitPrinter(3, parallelDowndloadCount, 30) : new AccumulatePrinter(3, parallelDowndloadCount, 30);
    synch(downloadDir, playlistId, printer, parallelDowndloadCount);
    return printer;
};

module.exports = dwytpl;
