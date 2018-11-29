# dwytpl

download youtube playlist

## example

```js
const dwytpl = require('dwytpl');

const path = '~\my-playlist-downloads';
const playlistId = 'OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw';

dwytpl(path, playlistId);
```

## api

`Printer dwytp(string downloadDir, string playlistId, int parallelDownloadCount = 10, boolean print = false)`

###`downloadDir` 

target directory to save downloaded videos to. Interrupted or incomplete video downloads will not be saved. Videos already found in this directory will not be downloaded again. 

### `playlistId`

youtube playlist id

### `parallelDownloadCount`

number of concurrent video downloads. Defaults to 10.

### `print`

boolean indicating whether the results should be printed to standard output.

```
todo: sample printer output
```

### return value

```
{
    stream<String[]> title,
    stream<String[]> summary,
    stream<String[]> progerss,
    stream<String[]> messages,
}
```

all 4 of the fields of the return object are streams of arrays of strings. For detailed information about streams, see [this npm package](https://www.npmjs.com/package/bs-better-stream). For a concrete example of using the return value, see [the below section](#example-using-return-value).

#### `title`

`title` stream values will be of the format 

```
['<playlist title> [<playlist length>]']
```

#### `summary`

`summary` stream values will be of the format
 
 ```
 [
    'skipped <skipped count>. downloaded <downloaded count>. failed <failed count>. remaining <remaining count>. total <total count>',
    '<percent> (<time estimate> remaining)'
 ]
 ```

#### `progress` & `messages`

`progress` and `message` streams values will be of the format

```
[
    '<number>-<video id>-<video title>' +
    'waiting to start' |
    'started' |
    '<percent> (<time> remaining) [<size>]' |
    'done downloading (<time>)' |
    'failed to download',
    ...
] 
```

## example using return value

```js
let tracker = dwytpl(path, playlistId);

tracker.summary
```
