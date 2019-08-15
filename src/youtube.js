const axios = require('axios');
const API_ENDPOINT = 'https://www.googleapis.com/youtube/v3';
const API_KEY = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';

const get = async endpoint => (await axios.get(endpoint)).data;

const getPlaylistOverview = id =>
    get(`${API_ENDPOINT}/playlists?part=snippet,contentDetails&id=${id}&key=${API_KEY}`);

const getPlaylistPage = (id, page) =>
    get(`${API_ENDPOINT}/playlistItems?part=snippet&maxResults=50&pageToken=${page}&playlistId=${id}&key=${API_KEY}`);

const getSearch = query =>
    get(`${API_ENDPOINT}/search?part=snippet&maxResults=15&type=video&q=${query}&key=${API_KEY}`);

module.exports = {getPlaylistOverview, getPlaylistPage, getSearch};
