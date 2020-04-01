const $tream = require('bs-better-stream');
const VideoContainer = require('./VideoContainer');
const Video = require('../Video');
const youtube = require('../youtube');

class Search extends VideoContainer {
    constructor() {
        super();
        this.searchCache_ = {};
        this.searchRelatedCache_ = {};
        this.queries_ = $tream();
        this.videos_ = this.queries_
            .pluck('items')
            .flatten()
            .map(({id: {videoId}, snippet: {title, thumbnails}}) =>
                ({videoId, title, thumbnail: thumbnails && thumbnails.default.url}))
            .uniqueOn('videoId')
            .map(({videoId, title, thumbnail}) => new Video(videoId, title, thumbnail));
    }

    query(query, maxResults = 15) {
        this.queries_.writePromise(this.getSearch_(query, maxResults))
    }

    queryRelated(videoId, maxResults = 15) {
        this.queries_.writePromise(this.getSearchRelated_(videoId, maxResults))
    }

    getSearch_(query, maxResults) {
        if (this.searchCache_[query]?.length >= maxResults)
            return this.searchCache_[query].slice(0, maxResults);
        return this.searchCache_[query] = youtube.getSearch(query, maxResults);
    }

    getSearchRelated_(videoId, maxResults) {
        if (this.searchRelatedCache_[videoId]?.length >= maxResults)
            return this.searchRelatedCache_[videoId].slice(0, maxResults);
        return this.searchRelatedCache_[videoId] = youtube.getSearchRelated(videoId, maxResults);
    }
}

module.exports = Search;
