const ytdl = require('ytdl-core');
const download = require('./download');

class Video {
    constructor(number, id, title, thumbnail) {
        this.number = number;
        this.id = id;
        this.title = Video.cleanTitle(title);
        this.thumbnail = thumbnail;
    }

    download(downloadDir) {
        download.prepareDir(downloadDir);
        return this.downloadStatus = download.downloadStream(downloadDir, this.getStream_(), this.getName());
    }

    getStream_() {
        return this.streamCache = this.streamCache || ytdl(this.id, {quality: 'lowest'});
    }

    getName() {
        let numberString = this.number.toString().padStart(5, 0);
        return `${numberString}-${this.id}-${this.title}`;
    }

    isSame(name) {
        return name.includes(`-${this.id}-${this.title}.`);
    }

    static cleanTitle(title) {
        return title.replace(/[^\w ]/g, '').replace(/ +/g, '_');
    }
}

module.exports = Video;
