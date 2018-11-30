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

boolean indicating whether the results should be continuously printed to standard output.

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
    '<number> <video title>#<video id>' +
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
const path = require('path');
const dwytpl = require('dwytpl');

let tracker = dwytpl(path.resolve(__dirname, 'downloads'), 'OLAK5uy_mt1gUnCahoe2g5rYOCCxLU_pMxBxcSbPw', 10);

tracker.title.each(([title]) =>
    console.log('new title:', title));
tracker.summary.each(lines => {
    console.log('new summary:');
    lines.forEach(line => console.log(line));
});
tracker.progerss.each(lines => {
    console.log('new progerss:');
    lines.forEach(line => console.log(line));
});
tracker.messages.each(lines => {
    console.log('new messages:');
    lines.forEach(line => console.log(line));
});
```
