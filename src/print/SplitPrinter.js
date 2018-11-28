const printer = require('./printer');
const AccumulatePrinter = require('./AccumulatePrinter');

class SplitPrinter extends AccumulatePrinter {
    constructor(titleSize, progressSize, messageSize) {
        super();
        this.titleSize = titleSize;
        this.progressSize = progressSize;
        this.messageSize = messageSize;
        printer.clear();
    }

    setTitleLine(index, line) {
        super.setTitleLine(index, line);
        this.print();
    }

    setProgressLine(index, line) {
        super.setProgressLine(index, line);
        this.print();
    }

    removeProgressLine(index) {
        super.removeProgressLine(index);
        this.print();
    }

    addMessageLine_(line) {
        super.addMessageLine_(line);
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
