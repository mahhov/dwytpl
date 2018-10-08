const stream = require('stream');
const fs = require('fs');

class MemoryWriteStream extends stream.Writable {
	constructor() {
		super();
		this.chunks = []
	}

	_write(chunk, enc, next) {
		this.chunks.push(chunk);
		next();
	}

	writeToFile(path, callback = () => {}) {
		let buffer = Buffer.concat(this.chunks);
		let writeStream = fs.writeFile(path, buffer, callback);
	}
}

module.exports = MemoryWriteStream;
