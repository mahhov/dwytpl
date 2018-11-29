const printer = require('./printer');
const AccumulatePrinter = require('./AccumulatePrinter');

class SplitPrinter extends AccumulatePrinter {
    constructor(titleSize, summarySize, progressSize, messageSize) {
        super();
        this.titleSize_ = titleSize;
        this.summarySize_ = summarySize;
        this.progressSize_ = progressSize;
        this.messageSize_ = messageSize;
        printer.clear();
    }

    onChange_() {
        let offset = 0;
        this.titleLines_.forEach((line, i) =>
            printer.line(i + offset, line));

        offset += this.titleSize_;
        this.summaryLines_.forEach((line, i) =>
            printer.line(i + offset, line));

        offset += this.summarySize_ + 1;
        for (let i = 0; i < this.progressSize_; i++) {
            if (i < this.progressLines_.length)
                printer.line(i + offset, this.progressLines_[i]);
            else
                printer.line(i + offset, '');
        }

        offset += this.progressSize_ + 1;
        let firstMessageIndex = Math.max(0, this.messageLines_.length - this.messageSize_);
        for (let i = firstMessageIndex; i < this.messageLines_.length; i++)
            printer.line(i - firstMessageIndex + offset, this.messageLines_[i]);
    }
}

module.exports = SplitPrinter;
