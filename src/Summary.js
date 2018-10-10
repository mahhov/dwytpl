const $tream = require('bs-better-stream');
const SummaryStatus = require('./SummaryStatus');

class Summary {
    constructor() {
        this.total = 0;
        this.predownloaded = 0;
        this.downloaded = 0;
	    this.failed = 0;

        this.status = new SummaryStatus();
        this.stream = this.status.stream;

        this.updateSummary();
    }

    setTotal(total) {
        this.total = total;
        this.updateSummary();
    }

    incrementPredownloaded() {
        this.predownloaded++;
        this.updateSummary();
    }

    incrementDownloaded() {
        this.downloaded++;
        this.updateSummary();
    }

	incrementFailed() {
		this.failed++;
		this.updateSummary();
	}

    updateSummary() {
        this.status.onProgress(
            this.downloaded,
            this.total - this.predownloaded - this.failed,
            this.total,
            this.predownloaded,
            this.downloaded,
	        this.failed);
    }

    onStart() {
        this.status.onStart();
    }
}

module.exports = Summary;
