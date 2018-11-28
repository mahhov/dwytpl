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

### return value `Printer`

`String[] Printer.titleLines`

`String[] Printer.progressLines`

`String[] Printer.removedProgressLines`

`String[] Printer.messageLines`

todo: explain data contained in the above Printer fields