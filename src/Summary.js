const SummaryStatus = require('./SummaryStatus');

class Summary {
    constructor() {
        this.total_ = 0;
        this.predownloaded_ = 0;
        this.downloaded_ = 0;
        this.failed_ = 0;

        this.status_ = new SummaryStatus();
        this.stream = this.status_.stream;

        this.updateSummary_();
    }

    setTotal(total) {
        this.total_ = total;
        this.updateSummary_();
    }

    incrementPredownloaded() {
        this.predownloaded_++;
        this.updateSummary_();
    }

    incrementDownloaded() {
        this.downloaded_++;
        this.updateSummary_();
    }

    incrementFailed() {
        this.failed_++;
        this.updateSummary_();
    }

    updateSummary_() {
        this.status_.onProgress(
            this.downloaded_,
            this.total_ - this.predownloaded_ - this.failed_,
            this.total_,
            this.predownloaded_,
            this.downloaded_,
            this.failed_);
    }

    onStart() {
        this.status_.onStart();
        this.updateSummary_();
    }
}

module.exports = Summary;
