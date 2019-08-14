const $tream = require('bs-better-stream');
const Video = require('./Video');
const youtube = require('./youtube');

class Playlist {
    constructor(id) {
        this.id_ = id;
        this.pageCache_ = {};
    }

    async getOverview() {
        let playlist = (await this.getOverview_()).items[0];
        return playlist
            ? {title: playlist.snippet.title, length: playlist.contentDetails.itemCount}
            : {title: `no playlist with id ${this.id_}`, length: 0};

    };

    getVideos() {
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

    getOverview_() {
        return this.overviewCache_ = this.overviewCache_ || youtube.getPlaylistOverview(this.id_);
    }

    getPage_(page = '') {
        return this.pageCache_[page] = this.pageCache_[page] || youtube.getPlaylistPage(this.id_, page);
    }
}

module.exports = Playlist;
