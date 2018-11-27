const printer = require('./printer');

class AccumulatePrinter {
    constructor() {
        this.titleLines = [];
        this.progressLines = [];
        this.removedProgressLines = [];
        this.messageLines = [];
    }

    setTitleLine(index, line) {
        this.titleLines[index] = line;
    }

    setProgressLine(index, line) {
        this.progressLines[index] = line;
    }

    removeProgressLine(index) {
        this.removedProgressLines.push(index);
        this.addMessageLine(this.progressLines[index]);
    }

    addMessageLine(line) {
        this.messageLines.push(line);
    }
}

module.exports = AccumulatePrinter;
