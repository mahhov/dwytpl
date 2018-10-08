const Status = require('./Status');

class SummaryStatus extends Status {
    startStatus() {
        return ['fetching', '...'];
    }

    progressStatus(percent, time, size, total, predownloaded, downloaded) {
        let counts = `already downloaded ${predownloaded}. downloaded ${downloaded}. remianing ${total - predownloaded - downloaded}. total ${total}`;
        let estimate = `${percent} (${time} remaining)`;
        return [counts, estimate];
    }
}

module.exports = SummaryStatus;
