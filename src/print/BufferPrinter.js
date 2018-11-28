const printer = require('./printer');

class BufferPrinter {
    constructor() {
        this.lines_ = [];
    }

    line(index, line) {
        this.lines_[index] = line;
        this.print();
    }

    print() {
        printer.clear();
        this.lines_.forEach((line, index) => printer.line(index, line));
    }
}

module.exports = BufferPrinter;
