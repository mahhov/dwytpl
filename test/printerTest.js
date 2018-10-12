const printer = require('../src/printer');

printer.clear();
for (let i = 0; i < 50; i++)
    printer.line(i, `line ${i}`);

[5, 10, 20].forEach(i => printer.line(i, `AND LINE${i}`));
