const $tream = require('bs-better-stream');
const PromiseW = require('promise-w');
const Syncher = require('./Syncher');
const Video = require('./Video');
const youtube = require('./youtube');

class Playlist extends Syncher.Synchable {
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
            .map(this.getPage_.bind(this))
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
            .map(({resourceId: {videoId}, title}, i) => new Video(i, videoId, title));
    }

    async getOverview() {
        let playlist = (await this.getOverview_()).items[0];
        return playlist
            ? {title: playlist.snippet.title, length: playlist.contentDetails.itemCount}
            : {title: `no playlist with id ${this.id_}`, length: 0};
    }

    async includesVideo(id) {
        await this.initVideosDone_;
        return this.videos_.outValues.some(video => video.id_ === id);
    }

    getOverview_() {
        return this.overviewCache_ = this.overviewCache_ || youtube.getPlaylistOverview(this.id_);
    }

    getPage_(page = '') {
        return this.pageCache_[page] = this.pageCache_[page] || youtube.getPlaylistPage(this.id_, page);
    }
}

module.exports = Playlist;
