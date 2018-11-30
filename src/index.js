const {synch} = require('./syncher');
const SplitPrinter = require('./print/SplitPrinter');

let dwytpl = (downloadDir, playlistId, parallelDownloadCount = 10) =>
    synch(downloadDir, playlistId, parallelDownloadCount);

dwytpl.SplitPrinter = SplitPrinter;

module.exports = dwytpl;
