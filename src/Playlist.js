const $tream = require('bs-better-stream');
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
        let pages = $tream();
        let responses = pages
            .map(this.getPage_.bind(this))
            .wait();
        responses
            .pluck('nextPageToken')
            .filter(nextPage => nextPage)
            .to(pages);
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

    getOverview_() {
        return this.overviewCache_ = this.overviewCache_ || youtube.getPlaylistOverview(this.id_);
    }

    getPage_(page = '') {
        return this.pageCache_[page] = this.pageCache_[page] || youtube.getPlaylistPage(this.id_, page);
    }
}

module.exports = Playlist;
