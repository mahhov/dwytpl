const printer = require('./printer');

class SplitPrinter {
    constructor(titleSize, progressSize, messageSize) {
        this.titleSize = titleSize;
        this.progressSize = progressSize;
        this.messageSize = messageSize;
        this.titleLines = [];
        this.progressLines = [];
        this.removedProgressLines = [];
        this.messageLines = [];
        printer.clear();
    }

    setTitleLine(index, line) {
        this.titleLines[index] = line;
        this.print();
    }

    setProgressLine(index, line) {
        this.progressLines[index] = line;
        this.print();
    }

    removeProgressLine(index) {
        this.removedProgressLines.push(index);
        this.addMessageLine(this.progressLines[index]);
    }

    addMessageLine(line) {
        this.messageLines.push(line);
        this.print();
    }

    print() {
        this.titleLines.forEach((line, i) =>
            printer.line(i, line));

        let skipLines = 0;
        this.progressLines.forEach((line, i) => {
            if (this.removedProgressLines.includes(i))
                skipLines++;
            else if (i - skipLines < this.progressSize)
                printer.line(i - skipLines + this.titleSize + 1, line);
        });

        let firstMessageIndex = Math.max(0, this.messageLines.length - this.messageSize);
        for (let i = firstMessageIndex; i < this.messageLines.length; i++)
            printer.line(i - firstMessageIndex + this.titleSize + this.progressSize + 2, this.messageLines[i]);
    }
}

module.exports = SplitPrinter;
