const SplitPrinter = require('../src/SplitPrinter');

let printer = new SplitPrinter(2, 3, 3);

printer.setTitleLine(0, 'title 0');
printer.setTitleLine(0, 'title 0b');
printer.setTitleLine(1, 'title 1');
printer.setTitleLine(1, 'title 1b');

printer.setProgressLine(0, 'progress 0');
printer.setProgressLine(2, 'progress 2');
printer.setProgressLine(1, 'progress 1');
printer.setProgressLine(1, 'progress 1b');
printer.setProgressLine(3, 'progress 3');
printer.setProgressLine(4, 'progress 4');
printer.removeProgressLine(3);
printer.removeProgressLine(0);
printer.removeProgressLine(2);

printer.addMessageLine('message 0');
printer.addMessageLine('message 1');
printer.addMessageLine('message 2');
printer.addMessageLine('message 3');
printer.addMessageLine('message 4');

console.log(`
EXPECTED:

'title 0b
title 1b

progress 1b
progress 4


message 2
message 3
message 4'
`);
