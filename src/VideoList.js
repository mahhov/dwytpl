const $tream = require('bs-better-stream');
const Syncher = require('./Syncher');
const Video = require('./Video');
const youtube = require('./youtube');

// todo move some shared code to Synchable
class VideoList extends Syncher.Synchable {
    constructor() {
        super();
        this.videoCache_ = {};
        this.ids_ = $tream();
        this.videos_ = this.ids_
            .pluck('items')
            .flatten()
            .map(({id, snippet: {title, thumbnails}}, i) => new Video(i, id, title, thumbnails && thumbnails.default.url))
    }

    async getOverview() {
        return {title: 'video list', length: this.ids_.length};
    }

    add(id) {
        this.ids_.writePromise(this.getVideo_(id));
    }

    getVideo_(id) {
        return this.videoCache_[id] = this.videoCache_[id] || youtube.getVideosTitles([id]);
    }
}

module.exports = VideoList;
