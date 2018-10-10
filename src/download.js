const fs = require('fs');
const VideoStatus = require('./VideoStatus');
const MemoryWriteStream = require('./MemoryWriteStream');
const {DOWNLOAD_DIR} = require('./config');

// todo doing this in sync slows us down? (exists, mkdir, copyfile)
prepareDir = () => fs.existsSync(DOWNLOAD_DIR) || fs.mkdirSync(DOWNLOAD_DIR);

downloadStream = (stream, name) => {
	let status = new VideoStatus(name);

	try {
		let writeStream = new MemoryWriteStream();
		stream.pipe(writeStream);

		stream.once('response', () => status.onStart());

		stream.on('error', error => status.onFail(error));

		stream.on('progress', (chunkLength, downloadedSize, totalSize) =>
			status.onProgress(downloadedSize, totalSize));

		stream.on('end', () =>
			writeStream.writeToFile(`${DOWNLOAD_DIR}/${name}.webm`, () => status.onSuccess()));

	} catch (error) {
		status.onFail(error);
	}

	return status;
};

module.exports = {prepareDir, downloadStream};
