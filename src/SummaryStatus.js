const Status = require('./Status');

class SummaryStatus extends Status {
    startStatus_() {
        return ['', '', {total: 0, predownloaded: 0, downloaded: 0, failed: 0}];
    }

    progressStatus_(percent, time, size, total, predownloaded, downloaded, failed) {
        let remaining = total - predownloaded - downloaded - failed;
        let counts = `skipped ${predownloaded}. downloaded ${downloaded}. failed ${failed}. remaining ${remaining}. total ${total}`;
        let estimate = `${percent} (${time} remaining)`;
        return [counts, estimate, {total, predownloaded, downloaded, failed}];
    }
}

module.exports = SummaryStatus;
