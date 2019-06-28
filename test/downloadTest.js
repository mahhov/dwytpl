const fs = require('fs');
const ytdl = require('ytdl-core');
const download = require('../src/download');
const MemoryWriteStream = require('../src/MemoryWriteStream');

download.prepareDir('temp');

const id = 'sJXZ9Dok7u8'; // HWyEEj2pSt0 403
const stream = ytdl(id, {quality: 'highestaudio'});
// const stream = ytdl(id, {filter: (format) => console.log(format)});

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
