const $tream = require('bs-better-stream');
const VideoContainer = require('./VideoContainer');
const Video = require('../Video');
const youtube = require('../youtube');

class VideoList extends VideoContainer {
    constructor() {
        super();
        this.videoCache_ = {};
        this.ids_ = $tream();
        this.videos_ = this.ids_
            .pluck('items')
            .flatten()
            .map(({id, snippet: {title, thumbnails}}) => new Video(id, title, thumbnails && thumbnails.default.url))
    }

    add(id) {
        this.ids_.writePromise(this.getVideo_(id));
    }

    getVideo_(id) {
        return this.videoCache_[id] = this.videoCache_[id] || youtube.getVideosTitles([id]);
    }
}

module.exports = VideoList;
