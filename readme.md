# dwytpl

download youtube playlists, videos, and search queries.

## example

```js
const dwytpl = require('dwytpl');

const path = '~\my-playlist-downloads';
const playlistId = 'OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw';

let playlist = new dwytpl.Playlist(playlistId);
let syncher = new dwytpl.Syncher(playlist.videos, path);

syncher.download();
```

## public api

### Playlist
##### `new Playlist(string playlistId)`
##### `Stream<Video> videos`
##### `Promise<string> title`
##### `Promise<number> length`

### VideoList

##### `new VideoList()`
##### `void add(string videoId)`
##### `Stream<Video> videos`

### Search

##### `new Search()`
##### `void query(string query, number maxResults = 15)`
##### `void queryRelated(string videoId, number maxResults = 15)`
##### `Stream<Video> videos`

### Video

##### `void download(string downloadDir, ytdlOptions = {filter: 'audioonly'})`
##### `void move(strng dir)`
##### `void stopDownload()`
##### `VideoStatus status`
##### `string id`
##### `string title`
##### `string fileName`
##### `string thumbnail`
##### `<Buffer> buffer`
##### `string Video.idFromFileName(string fileName)`
##### `string Video.titleFromFileName(string fileName)`
##### `Video.on('data', () => {})`
##### `Video.on('end', () => {})`

### VideoStatus

##### `Stream<string> stream`
##### `Promise promise`
##### `bool downloaded`
##### `bool failed`
##### `Array<{string dir, string name}> downloadFiles`

### Syncher

##### `new Syncher(Stream<Video> videos, string downloadDir, string[] alternateDirs, bool moveFromAltneativeDirs = false)`
##### `void download(number parallelDownloadCount = 10, ytdlOptions = {filter: 'audioonly'})`
##### `void stopDownload(bool toBeReused = false)`

##### `Tracker tracker`

### Tracker

##### `Stream<[string counts, string estimate, {<see below>}]> Tracker.summary`

stream values will be of the format
 
 ```
 [
    'skipped <skipped count>. downloaded <downloaded count>. failed <failed count>. remaining <remaining count>. total <total count>',
    '<percent> (<time estimate> remaining)',
    {number total, number predownloaded, number downloaded, number failed}
 ]
 ```

##### `Stream<string[]> Tracker.progress`

stream values will be of the format

```
[
    'waiting to start' |
    'started' |
    '<percent> (<time> remaining) [<size>]' |
    'done downloading (<time>)' |
    'failed to download',
    ...
] 
```

##### `Stream<string[]> Tracker.messages`

stream values will be of the same format as `Tracker.progress`'s stream values

#### example using Tracker

```js
const path = require('path');
const dwytpl = require('dwytpl');

let downloadDir = path.resolve(__dirname, '../downloads');
let playlistId = 'OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw';

let playlist = new dwytpl.Playlist(playlistId);
let syncher = new dwytpl.Syncher(playlist.videos, downloadDir);
let tracker = syncher.tracker;

syncher.download();

tracker.title.each(([title]) =>
    console.log('new title:', title));
tracker.summary.each(lines => {
    console.log('new summary:');
    lines.forEach(line => console.log(line));
});
tracker.progress.each(lines => {
    console.log('new progress:');
    lines.forEach(line => console.log(line));
});
tracker.messages.each(lines => {
    console.log('new messages:');
    lines.forEach(line => console.log(line));
});
```

### SplitPrinter

`SplitPrinter` is an in-place console printer.

##### `new SplitPrinter(number titleLines, number summaryLines, number progressLines, number messageLines)`

##### `set titleLines(string[])`

##### `set summaryLines(string[])`

##### `set progressLines(string[])`

##### `set messageLines(string[])`

#### example using SplitPrinter

```js
const path = require('path');
const dwytpl = require('dwytpl');

let tracker = dwytpl(path.resolve(__dirname, '../downloads'), 'OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw', 10);

let splitPrinter = new dwytpl.SplitPrinter(1, 2, 10, 30);

tracker.title.each(titleLines =>
    splitPrinter.titleLines = titleLines);
tracker.summary.each(summaryLines =>
    splitPrinter.summaryLines = summaryLines.slice(0, 2));
tracker.progress.each(progressLines =>
    splitPrinter.progressLines = progressLines);
tracker.messages.each(messageLines =>
    splitPrinter.messageLines = messageLines);
```

#### SplitPrinter output
```
Classical Music Playlist [65]
skipped 0. downloaded 7. failed 0. remaining 58. total 65
10.77% (24.98 minutes remaining)

0000 Symphony_No_4_in_F_minor_Op_36_II_Andant     70.19% (72.04 seconds remaining) [8.01 MB]
0003 Finlandia_Op_26#ttSfHy9BI8w                  78.51% (43.08 seconds remaining) [6.75 MB]
0005 The_Lark_Ascending#TA5EfjamTUA               43.67% (3.37 minutes remaining) [12.13 MB]
0006 Brandenburg_Concerto_No3_in_G_Major_BWV_     32.95% (5.61 minutes remaining) [16.69 MB]
0009 La_Valse#NQGY1VBpSmo                         55.16% (137.73 seconds remaining) [10.20 MB]
0010 Piano_Sonata_No_14_in_C_Sharp_Minor_Op_2     94.67% (7.21 seconds remaining) [4.62 MB]
0013 Pavane_pour_une_infante_dfunte#d-rJmeTA9     52.32% (64.12 seconds remaining) [4.99 MB]
0014 Pavane_Op_50#RV_uPAwO5Po                     32.69% (68.25 seconds remaining) [4.59 MB]
0015 Preludes_Book_I_VIII_La_fille_aux_cheveu     22.84% (50.05 seconds remaining) [4.04 MB]
0016 Spartacus_Suite_No_1_I_Adagio_of_Spartac     10.65% (95.13 seconds remaining) [8.22 MB]

0002 Lakm_Act_I_The_Flower_Duet#V0pakGAv6Uo       done downloading (36.35 seconds)
0007 Pie_Jesu#D17TEgTwc6c                         done downloading (30.76 seconds)
0001 Stars_and_Stripes_Forever#43i4UvNHgoM        done downloading (82.10 seconds)
0004 Peer_Gynt_Suite_No_1_Op_46_I_Morning_Moo     done downloading (104.58 seconds)
0011 Serenade_in_G_major_Eine_kleine_Nachtmus     done downloading (82.16 seconds)
0012 Elizabethan_Serenade#aUxeE56k7XI             done downloading (75.47 seconds)
0008 Gaspard_de_la_nuit_I_Ondine#c0y8JfJsK8o      done downloading (162.20 seconds)
```

### API key

By default, this module uses a public API key for its requests. It's very likely this will repeatedly surpass quotas and not work. Instead, it's recommended to specify an API key unique to your project using the `setApiKey(string)` method.

```$xslt
const dwytpl = require('dwytpl');
dwytpl.setApiKey('...');
```

## note on Stream's

this module and its api use `Stream`s extensively. For detailed information about streams, see the [bs-better-stream npm package](https://www.npmjs.com/package/bs-better-stream).
