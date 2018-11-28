const stream = require('stream');
const fs = require('fs');

class MemoryWriteStream extends stream.Writable {
	constructor() {
		super();
		this.chunks_ = []
	}

	_write(chunk, enc, next) {
		this.chunks_.push(chunk);
		next();
	}

	writeToFile(path, callback = () => {}) {
		let buffer = Buffer.concat(this.chunks_);
		let writeStream = fs.writeFile(path, buffer, callback);
	}
}

module.exports = MemoryWriteStream;
