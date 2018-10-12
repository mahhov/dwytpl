const fileWalker = require('file-walk-stream');

console.log('begin')

fileWalker.walk('.')
    .each(console.log.bind(console))
