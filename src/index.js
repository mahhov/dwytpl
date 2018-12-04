const {synch} = require('./syncher');
const SplitPrinter = require('./print/SplitPrinter');
const Playlist = require('./Playlist');

let dwytpl = (downloadDir, playlistId, parallelDownloadCount = 10) =>
    synch(downloadDir, playlistId, parallelDownloadCount);

dwytpl.SplitPrinter = SplitPrinter;
dwytpl.Playlist = Playlist;

module.exports = dwytpl;
