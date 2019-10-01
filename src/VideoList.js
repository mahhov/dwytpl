const $tream = require('bs-better-stream');
const Syncher = require('./Syncher');
const Video = require('./Video');
const youtube = require('./youtube');

class VideoList extends Syncher.Synchable {
    constructor() {
        super();
        this.ids_ = $tream();
        this.videos_ = this.ids_
            .map(async (id, i) => new Video(i, id, await VideoList.getTitle(id)))
            .wait();
    }

    async getOverview() {
        return {title: 'video list', length: this.ids_.length};
    }

    async add(id) {
        this.ids_.write(id);
    }

    static async getTitle(id) {
        let response = await youtube.getVideosTitles([id]);
        return response.items[0].snippet.title;
    }
}

module.exports = VideoList;
