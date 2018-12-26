const Status = require('./Status');

class VideoStatus extends Status {
    constructor(prefix) {
        super();
        this.prefix_ = prefix;
        this.onInitialization_();
    }

    setStatus_(status) {
        const PREFIX_MAX_LENGTH = 45, WHITESPACE = 5;
        let prefix = this.prefix_.slice(0, PREFIX_MAX_LENGTH).padEnd(PREFIX_MAX_LENGTH + WHITESPACE);
        status = prefix + status;
        super.setStatus_(status);
    }

    initializationStatus_() {
        return 'waiting to start';
    }

    startStatus_() {
        return 'started';
    }

    progressStatus_(percent, time, size) {
        return `${percent} (${time} remaining) [${size}]`;
    }

    successStatus_(time) {
        return `done downloading (${time})`;
    }

    failureStatus_(error) {
        return 'failed to download. ' + error.message;
    }
}

module.exports = VideoStatus;
