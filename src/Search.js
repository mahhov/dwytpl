const $tream = require('bs-better-stream');
const Syncher = require('./Syncher');
const Video = require('./Video');
const youtube = require('./youtube');

class Search extends Syncher.Synchable {
    constructor() {
        super();
        this.searchCache_ = {};
        this.queries_ = $tream();
        this.videos_ = this.queries_
            .pluck('items')
            .flatten()
            .map(({id: {videoId}, snippet: {title, thumbnails}}) =>
                ({videoId, title, thumbnail: thumbnails && thumbnails.default.url}))
            .uniqueOn('videoId')
            .map(({videoId, title, thumbnail}, i) => new Video(i, videoId, title, thumbnail));
    }

    query(query) {
        this.queries_.writePromise(this.getSearch_(query))
    }

    getSearch_(query) {
        return this.searchCache_[query] = this.searchCache_[query] || youtube.getSearch(query);
    }
}

module.exports = Search;
