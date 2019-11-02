const ytdl = require('ytdl-core');
const VideoStatus = require('./VideoStatus');
const fs = require('fs');
const MemoryWriteStream = require('./MemoryWriteStream');

class Video {
    constructor(number, id, title, thumbnail) {
        this.number_ = number;
        this.id_ = id;
        this.title_ = Video.cleanTitle_(title);
        this.thumbnail = thumbnail;
        this.status = new VideoStatus();
    }

    download(downloadDir, audioOnly = true) {
        // todo doing this in sync slows us down? (exists, mkdir, copyfile)
        if (!fs.existsSync(downloadDir))
            fs.mkdirSync(downloadDir);

        let stream = this.getStream_(audioOnly);
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

    getStream_(audioOnly) {
        let ytdlOptions = audioOnly ?
            {quality: 'highestaudio'} : // todo consider audio only for smaller storage
            {quality: 'highestvideo', filter: 'audioandvideo'};
        return this.streamCache_ = this.streamCache_ || ytdl(this.id_, ytdlOptions);
    }

    get id() {
        return this.id_;
    }

    get title() {
        return this.title_;
    }

    get fileName() {
        return `${this.title_}-${this.id_}.webm`;
    }

    get numberedFileName() {
        let numberString = this.number_.toString().padStart(4, 0);
        return `${numberString} ${this.fileName}`;
    }

    static idFromFileName(fileName) {
        let m = fileName.match(/-([^.]*)./);
        return m && m[1];
    }

    static cleanTitle_(title) {
        return title.replace(/[^\w ]/g, '').replace(/ +/g, '_');
    }
}

module.exports = Video;
