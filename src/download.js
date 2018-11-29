const fs = require('fs');
const VideoStatus = require('./VideoStatus');
const MemoryWriteStream = require('./MemoryWriteStream');

// todo doing this in sync slows us down? (exists, mkdir, copyfile)
prepareDir = downloadDir => fs.existsSync(downloadDir) || fs.mkdirSync(downloadDir);

downloadStream = (downloadDir, stream, statusName, fileName) => {
	let status = new VideoStatus(statusName);

	try {
		let writeStream = new MemoryWriteStream();
		stream.pipe(writeStream);

		stream.once('response', () => status.onStart());

		stream.on('error', error => status.onFail(error));

		stream.on('progress', (chunkLength, downloadedSize, totalSize) =>
			status.onProgress(downloadedSize, totalSize));

		stream.on('end', () =>
			writeStream.writeToFile(`${downloadDir}/${fileName}`, () => status.onSuccess()));

	} catch (error) {
		status.onFail(error);
	}

	return status;
};

module.exports = {prepareDir, downloadStream};
