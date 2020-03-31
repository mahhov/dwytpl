const fs = require('fs');
const ytdl = require('ytdl-core');
const VideoStatus = require('./VideoStatus');
const MemoryWriteStream = require('./MemoryWriteStream');

class Video {
    constructor(id, title, thumbnail) {
        this.id = id;
        this.title = Video.cleanTitle_(title);
        this.thumbnail = thumbnail;
        this.status = new VideoStatus();
    }

    download(downloadDir, ytdlOptions = {filter: 'audioonly'}) {
        // todo doing this in sync slows us down? (exists, mkdir, copyfile)
        if (!fs.existsSync(downloadDir))
            fs.mkdirSync(downloadDir);

        let stream = this.getStream_(ytdlOptions);
        try {
            let writeStream = new MemoryWriteStream();
            stream.pipe(writeStream);
            stream.once('response', () => this.status.onStart());
            stream.on('error', error => this.status.onFail(error));
            stream.on('progress', (chunkLength, downloadedSize, totalSize) =>
                this.status.onProgress(downloadedSize, totalSize));
            stream.on('end', () =>
                writeStream.writeToFile(`${downloadDir}/${this.fileName}`, () => this.status.onSuccess(downloadDir, this.fileName)));
        } catch (error) {
            this.status.onFail(error);
        }
    }

    move(dir) {
        if (this.status.downloadFiles.map(({dir}) => dir).includes(dir))
            return;
        return fs.promises.rename(
            `${this.status.downloadFiles[0].dir}/${this.status.downloadFiles[0].name}`,
            `${dir}/${this.fileName}`);
    }

    stopDownload() {
        if (!this.streamCache_)
            return;
        this.streamCache_.destroy();
        this.streamCache_ = null;
    }

    getStream_(ytdlOptions) {
        return this.streamCache_ = this.streamCache_ || ytdl(this.id, ytdlOptions);
    }

    get fileName() {
        return `${this.title}-${this.id}.webm`;
    }

    static idFromFileName(fileName) {
        return fileName.match(/-([^.]*)./)?.[1];
    }

    static cleanTitle_(title) {
        return title.replace(/[^\w ]/g, '').replace(/ +/g, '_');
    }
}

module.exports = Video;
