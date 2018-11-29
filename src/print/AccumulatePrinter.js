class AccumulatePrinter {
    constructor() {
        this.titleLines_ = [];
        this.summaryLines_ = [];
        this.progressLines_ = [];
        this.messageLines_ = [];
    }

    set titleLines(value) {
        this.titleLines_ = value;
        this.onChange_();
    }

    set summaryLines(value) {
        this.summaryLines_ = value;
        this.onChange_();
    }

    set progressLines(value) {
        this.progressLines_ = value;
        this.onChange_();
    }

    set messageLines(value) {
        this.messageLines_ = value;
        this.onChange_();
    }

    onChange_() {
        // abstract
    }
}

module.exports = AccumulatePrinter;
