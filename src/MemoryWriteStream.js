const stream = require('stream');
const fs = require('fs');

class MemoryWriteStream extends stream.Writable {
    constructor() {
        super();
        this.chunks_ = [];
    }

    _write(chunk, enc, next) {
        this.chunks_.push(chunk);
        next();
    }

    get buffer() {
        return Buffer.concat(this.chunks_);
    }

    writeToFile(path) {
        fs.promises.writeFile(path, this.buffer);
    }
}

module.exports = MemoryWriteStream;
