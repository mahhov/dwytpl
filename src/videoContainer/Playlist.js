const $tream = require('bs-better-stream');
const PromiseW = require('promise-w');
const VideoContainer = require('./VideoContainer');
const Video = require('../Video');
const youtube = require('../youtube');

class Playlist extends VideoContainer {
    constructor(id) {
        super();
        this.id_ = id;
        this.pageCache_ = {};
        this.videos_ = this.initVideos_();
    }

    initVideos_() {
        this.initVideosDone_ = new PromiseW();
        let pages = $tream();
        let responses = pages
            .map(page => this.getPage_(page))
            .wait();
        responses
            .pluck('nextPageToken')
            .split(nextPage => nextPage,
                nonLastPages => nonLastPages.to(pages),
                lastPages => lastPages.each(() => this.initVideosDone_.resolve()));
        pages.write('');
        return responses
            .pluck('items')
            .flatten()
            .pluck('snippet')
            .map(({resourceId: {videoId}, title, thumbnails}) =>
                ({videoId, title, thumbnail: thumbnails?.default?.url}))
            .uniqueOn('videoId')
            .map(({videoId, title, thumbnail}) => new Video(videoId, title, thumbnail));
    }

    get title() {
        return this.getOverview_().then(overview => overview.items[0]?.snippet.title);
    }

    get length() {
        return this.getOverview_().then(overview => overview.items[0]?.contentDetails.itemCount);
    }

    getOverview_() {
        return this.overviewCache_ = this.overviewCache_ || youtube.getPlaylistOverview(this.id_);
    }

    getPage_(page = '') {
        return this.pageCache_[page] = this.pageCache_[page] || youtube.getPlaylistPage(this.id_, page);
    }
}

module.exports = Playlist;
