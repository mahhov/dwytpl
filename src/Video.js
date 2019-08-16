const ytdl = require('ytdl-core');
const download = require('./download');

class Video {
    constructor(number, id, title) {
        this.number_ = number;
        this.id_ = id;
        this.title_ = Video.cleanTitle_(title);
    }

    download(downloadDir) {
        download.prepareDir(downloadDir);
        return download.downloadStream(downloadDir, this.getStream_(), this.getName_(), this.getFileName_());
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
