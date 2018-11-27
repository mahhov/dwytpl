const printer = require('./printer');

class BufferPrinter {
    constructor() {
        this.lines = [];
    }

    line(index, line) {
        this.lines[index] = line;
        this.print();
    }

    print() {
        printer.clear();
        this.lines.forEach((line, index) => printer.line(index, line));
    }
}

module.exports = BufferPrinter;
