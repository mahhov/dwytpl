const Status = require('./Status');

class SummaryStatus extends Status {
    startStatus_() {
        return ['fetching', '...'];
    }

    progressStatus_(percent, time, size, total, predownloaded, downloaded, failed) {
        let counts = `already downloaded ${predownloaded}. downloaded ${downloaded}. failed ${failed}. remianing ${total - predownloaded - downloaded}. total ${total}`;
        let estimate = `${percent} (${time} remaining)`;
        return [counts, estimate];
    }
}

module.exports = SummaryStatus;
