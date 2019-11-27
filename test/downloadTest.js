const fs = require('fs');
const ytdl = require('ytdl-core');
// const download = require('../src/download');
const MemoryWriteStream = require('../src/MemoryWriteStream');

// download.prepareDir('temp');

const id = 'QvtjAoFBmVg';
const stream = ytdl(id, {quality: 'highestaudio', filter: 'audioonly'});

// ytdl.getInfo(id, {quality: 'highestaudio'}, (err, info) => {
//     if (err) throw err;
//     // let formats = ytdl.filterFormats(info.formats);
//     let formats = info.formats;
//     console.log('Formats with only audio: ' + formats.length);
//     console.log(JSON.stringify(formats));
// });

// console.log('all formats:')
// const stream = ytdl(id, {filter: (format) => console.log(JSON.stringify(format))});

const writeStream = new MemoryWriteStream();
stream.pipe(writeStream);
stream.once('response', () => console.log('response'));
stream.on('error', error => console.log('error', error));
stream.on('progress', (chunkLength, downloadedSize, totalSize) =>
    console.log('progress', downloadedSize, '/', totalSize));
stream.on('end', () =>
    writeStream.writeToFile('temp/songDefault.webm', () => console.log('end')));

// ytdl('http://www.youtube.com/watch?v=HWyEEj2pSt0')
// 	.pipe(fs.createWriteStream('video.flv'));
