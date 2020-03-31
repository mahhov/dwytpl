const dwytpl = require('../src/index');

let playlist = new dwytpl.Playlist('OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw');

playlist.title.then(title => console.log('title', title));
playlist.title.then(length => console.log('length', length));

[
    'WTOm79kzVyE',
    'XyDlLfrba6s',
    '0rgDg96pGn0',
    '123',
    '0rgDg96pGn0x',
    '0rgDg96pGn4',
].forEach((id, i) => playlist.getPlaylistItemId(id).then(a => console.log(i, a)));
