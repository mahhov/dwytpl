const fs = require('fs');
const ytdl = require('ytdl-core');
// const download = require('../src/download');
const MemoryWriteStream = require('../src/MemoryWriteStream');

// download.prepareDir('temp');

const id = 'QvtjAoFBmVg';
// const stream = ytdl(id, {filter: format => format.itag === 251});

// ytdl.getInfo(id, (err, info) => {
//     if (err) throw err;
//     // let formats = ytdl.filterFormats(info.formats);
//     let formats = info.formats;
//     console.log('Formats count: ' + formats.length);
//     console.log(JSON.stringify(formats));
// });
// return;

// console.log('all formats:')
// const stream = ytdl(id, {filter: format => !format.qualityLabel});
const stream = ytdl(id, {filter: 'audioonly'});

const writeStream = new MemoryWriteStream();
stream.pipe(writeStream);
stream.once('response', () => console.log('response'));
stream.on('error', error => console.log('error', error));
stream.on('progress', (chunkLength, downloadedSize, totalSize) =>
    console.log('progress', downloadedSize, '/', totalSize, Math.round(downloadedSize / totalSize * 100)));
stream.on('end', () =>
    writeStream.writeToFile('./songDefault.webm').then(() => console.log('end')));

// ytdl('http://www.youtube.com/watch?v=HWyEEj2pSt0')
// 	.pipe(fs.createWriteStream('video.flv'));
