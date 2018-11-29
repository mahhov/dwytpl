const printer = require('./printer');
const AccumulatePrinter = require('./AccumulatePrinter');

class SplitPrinter extends AccumulatePrinter {
    constructor(titleSize, progressSize, messageSize) {
        super();
        this.titleSize_ = titleSize;
        this.progressSize_ = progressSize;
        this.messageSize_ = messageSize;
        printer.clear();
    }

    onChange_() {
        this.titleLines_.forEach((line, i) =>
            printer.line(i, line));

        for (let i = 0; i < this.progressSize_; i++) {
            if (i < this.progressLines_.length)
                printer.line(i + this.titleSize_ + 1, this.progressLines_[i]);
            else
                printer.line(i + this.titleSize_ + 1, '');
        }

        let firstMessageIndex = Math.max(0, this.messageLines_.length - this.messageSize_);
        for (let i = firstMessageIndex; i < this.messageLines_.length; i++)
            printer.line(i - firstMessageIndex + this.titleSize_ + this.progressSize_ + 2, this.messageLines_[i]);
    }
}

module.exports = SplitPrinter;
