const FileWalker = require('file-walk-stream');
const {DOWNLOAD_DIR} = require('./config');

let getFiles = () => FileWalker.walk(DOWNLOAD_DIR);

module.exports = {getFiles};
