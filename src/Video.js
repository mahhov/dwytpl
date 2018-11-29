const ytdl = require('ytdl-core');
const download = require('./download');

class Video {
    constructor(number, id, title, thumbnail) {
        this.number_ = number;
        this.id_ = id;
        this.title_ = Video.cleanTitle_(title);
    }

    download(downloadDir) {
        download.prepareDir(downloadDir);
        return download.downloadStream(downloadDir, this.getStream_(), this.getName_(), this.getFileName_());
    }

    getStream_() {
        return this.streamCache_ = this.streamCache_ || ytdl(this.id_, {quality: 'lowest'});
    }

    getName_() {
        let numberString = this.number_.toString().padStart(4, 0);
        return `${numberString} ${this.getFileName_()}`;
    }

    getFileName_() {
        return `${this.title_}#${this.id_}.webm`;
    }

    isSame(fileName) {
        return fileName === this.getFileName_();
    }

    static cleanTitle_(title) {
        return title.replace(/[^\w ]/g, '').replace(/ +/g, '_');
    }
}

module.exports = Video;
