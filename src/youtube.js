const axios = require('axios');
const API_ENDPOINT = 'https://www.googleapis.com/youtube/v3';
const API_KEY = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';

const get = async (path, queryParamsObj) =>
    (await axios.get(`${API_ENDPOINT}/${path}?${queryParams(queryParamsObj)}`)).data;

const queryParams = (params = {}) =>
    Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');

const getPlaylistOverview = playlistId =>
    get('playlists', {part: 'snippet,contentDetails', id: playlistId, key: API_KEY});

const getPlaylistPage = (playlistId, pageToken) =>
    get('playlistItems', {part: 'snippet', maxResults: 50, pageToken, playlistId, key: API_KEY});

const getSearch = (query, maxResults) =>
    get('search', {part: 'snippet', maxResults, type: 'video', q: query, key: API_KEY});

const getSearchRelated = (relatedToVideoId, maxResults) =>
    get('search', {part: 'snippet', maxResults, type: 'video', relatedToVideoId, key: API_KEY});

const getVideosTitles = ids =>
    get('videos', {part: 'snippet', id: ids.join(','), key: API_KEY});

module.exports = {getPlaylistOverview, getPlaylistPage, getSearch, getSearchRelated, getVideosTitles};
