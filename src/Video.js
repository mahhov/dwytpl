const ytdl = require('ytdl-core');
const VideoStatus = require('./VideoStatus');
const fs = require('fs');
const MemoryWriteStream = require('./MemoryWriteStream');

class Video {
    constructor(number, id, title) {
        this.number_ = number;
        this.id_ = id;
        this.title_ = Video.cleanTitle_(title);
        this.status = new VideoStatus(this.getName_());
    }

    setDownloaded() {
        this.downloaded_ = true;
        this.status.onSuccess();
    }

    isDownloaded() {
        return this.downloaded_;
    }

    download(downloadDir) {
        // todo doing this in sync slows us down? (exists, mkdir, copyfile)
        if (!fs.existsSync(downloadDir))
            fs.mkdirSync(downloadDir);

        let stream = this.getStream_();
        try {
            let writeStream = new MemoryWriteStream();
            stream.pipe(writeStream);
            stream.once('response', () => this.status.onStart());
            stream.on('error', error => this.status.onFail(error));
            stream.on('progress', (chunkLength, downloadedSize, totalSize) =>
                this.status.onProgress(downloadedSize, totalSize));
            stream.on('end', () =>
                writeStream.writeToFile(`${downloadDir}/${this.getFileName_()}`, () => this.status.onSuccess()));
        } catch (error) {
            this.status.onFail(error);
        }
    }

    stopDownload() {
        if (!this.streamCache_)
            return;
        this.streamCache_.destroy();
        this.streamCache_ = null;
    }

    getStream_() {
        return this.streamCache_ = this.streamCache_ || ytdl(this.id_, {quality: 'highestaudio'});
    }

    getName_() {
        let numberString = this.number_.toString().padStart(4, 0);
        return `${numberString} ${this.getFileName_()}`;
    }

    getFileName_() {
        return `${this.title_}-${this.id_}.webm`;
    }

    isSame(fileName) {
        return fileName.match(/-([^.]*)./)[1] === this.id_;
    }

    static cleanTitle_(title) {
        return title.replace(/[^\w ]/g, '').replace(/ +/g, '_');
    }
}

module.exports = Video;
