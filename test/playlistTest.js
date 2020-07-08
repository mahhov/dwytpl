const dwytpl = require('../src/index');

let playlist = new dwytpl.Playlist('RDEMcHoPxTOy3R6SYpiLmJ_e4Q');

playlist.title.then(title => console.log('title', title));
playlist.length.then(length => console.log('length', length));

// playlist.videos.each((v, i) => console.log(i, v));
