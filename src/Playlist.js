const axios = require('axios');
const $tream = require('bs-better-stream');
const Video = require('./Video');
const apiUrl = 'https://www.googleapis.com/youtube/v3';
const apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';

class Playlist {
    constructor(id) {
        this.id_ = id;
        this.pageCache_ = {};
    }

    getOverview() {
        return this.getOverview_().then(overview => {
            let playlist = overview.items[0];
            return playlist
                ? {title: playlist.snippet.title, length: playlist.contentDetails.itemCount}
                : {title: `no playlist with id ${this.id_}`, length: 0};
        });
    };

    getVideos() {
        let pages = $tream();
        let responses = pages
            .map(this.getPage_.bind(this))
            .wait()
        responses
            .pluck('nextPageToken')
            .filter(nextPage => nextPage)
            .to(pages);
        pages.write('');
        return responses
            .pluck('items')
            .flatten()
            .pluck('snippet')
            .map((snippet, i) => new Video(
                i,
                snippet.resourceId.videoId,
                snippet.title,
                snippet.thumbnails && snippet.thumbnails.default.url));
    }

    getOverview_() {
        return this.overviewCache_ = this.overviewCache_ ||
            axios.get(`${apiUrl}/playlists?part=snippet,contentDetails&id=${this.id_}&key=${apiKey}`)
                .then(response => response.data)
    }

    getPage_(page = '') {
        return this.pageCache_[page] = this.pageCache_[page] ||
            axios.get(`${apiUrl}/playlistItems?part=snippet&maxResults=50&pageToken=${page}&playlistId=${this.id_}&key=${apiKey}`)
                .then(response => response.data)
    }
}

module.exports = Playlist;
