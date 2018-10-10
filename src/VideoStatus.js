const Status = require('./Status');

class VideoStatus extends Status {
    constructor(prefix) {
        super();
        this.prefix = prefix;
        super.onInitialization();
    }

    setStatus(status) {
        const PREFIX_MAX_LENGTH = 45, WHITESPACE = 5;
        let prefix = this.prefix.slice(0, PREFIX_MAX_LENGTH).padEnd(PREFIX_MAX_LENGTH + WHITESPACE);
        status = prefix + status;
        super.setStatus(status);
    }

    initializationStatus() {
        return 'waiting to start';
    }

    startStatus() {
        return 'started';
    }

    progressStatus(percent, time, size) {
        return `${percent} (${time} remaining) [${size}]`;
    }

    successStatus(time) {
        return `done downloading (${time})`;
    }

    failureStatus(error) {
        return 'failed to download. ' + error.message;
    }
}

module.exports = VideoStatus;
