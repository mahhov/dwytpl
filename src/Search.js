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
            .map(({id: {videoId}, snippet: {title}}, i) => new Video(i, videoId, title));
    }

    query(query) {
        this.queries_.writePromise(this.getSearch_(query))
    }

    getVideos() {
        return this.videos_;
    }

    getSearch_(query) {
        return this.searchCache_[query] = this.searchCache_[query] || youtube.getSearch(query);
    }
}

module.exports = Search;
