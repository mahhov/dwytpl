const EventEmitter = require('events');
const fs = require('fs');
const ytdl = require('ytdl-core');
const VideoStatus = require('./VideoStatus');
const MemoryWriteStream = require('./MemoryWriteStream');

class Video extends EventEmitter {
    constructor(id, title, thumbnail) {
        super();
        this.id = id;
        this.title = Video.cleanTitle_(title);
        this.thumbnail = thumbnail;
        this.status = new VideoStatus();
    }

    async download(downloadDir, ytdlOptions = {filter: 'audioonly'}) {
        // todo doing this in sync slows us down? (exists, mkdir, copyfile)
        if (!fs.existsSync(downloadDir))
            fs.mkdirSync(downloadDir);

        await this.getWriteStream(ytdlOptions).promise;
        await this.writeStream_.writeToFile(`${downloadDir}/${this.fileName}`);
        this.status.onSuccess(downloadDir, this.fileName);
    }

    move(dir) {
        if (this.status.downloadFiles.map(({dir}) => dir).includes(dir))
            return;
        return fs.promises.rename(
            `${this.status.downloadFiles[0].dir}/${this.status.downloadFiles[0].name}`,
            `${dir}/${this.fileName}`);
    }

    stopDownload() {
        this.streamCache_?.destroy();
        this.streamCache_ = null;
        this.writeStream_ = null;
    }

    getStream_(ytdlOptions) {
        return this.streamCache_ = this.streamCache_ || ytdl(this.id, ytdlOptions);
    }

    get fileName() {
        return `${this.title}-${this.id}.webm`;
    }

    getWriteStream(ytdlOptions = {filter: 'audioonly'}) {
        if (!this.writeStream_) {
            this.writeStream_ = new MemoryWriteStream();
            let onError = (error) => {
                this.status.onFail(error);
                this.writeStream_.promise.reject();
            };
            try {
                let stream = this.getStream_(ytdlOptions);
                stream.pipe(this.writeStream_);
                stream.once('response', () => this.status.onStart());
                stream.on('error', onError);
                stream.on('progress', (chunkLength, downloadedSize, totalSize) => {
                    this.emit('data');
                    this.status.onProgress(downloadedSize, totalSize)
                });
                stream.on('end', () => {
                    this.emit('end');
                    this.writeStream_.promise.resolve();
                });
            } catch (error) {
                onError(error);
            }
        }
        return this.writeStream_;
    }

    get buffer() {
        return this.getWriteStream().buffer;
    }

    static idFromFileName(fileName) {
        return fileName.match(/-([^.]*)./)?.[1];
    }

    static titleFromFileName(fileName) {
        return fileName.match(/(.*)-/)?.[1];
    }

    static cleanTitle_(title) {
        return title.replace(/[^\w ]/g, '').replace(/ +/g, '_');
    }
}

module.exports = Video;
