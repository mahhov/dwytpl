const Status = require('./Status');

class VideoStatus extends Status {
    constructor() {
        super();
        this.downloadFiles = []; // dir & name tuples
        this.onInitialization_();
    }

    onSuccess(downloadDir, downloadName) {
        this.downloadFiles.push({dir: downloadDir, name: downloadName});
        super.onSuccess();
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
