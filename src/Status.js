const $tream = require('bs-better-stream');
const PromiseW = require('PromiseW');

class Status {
    constructor() {
        this.stream = $tream();
        this.promiseWrap_ = new PromiseW();
    }

    get promise() {
        return this.promiseWrap_;
    }

    get downloaded() {
        return this.promiseWrap_.resolved;
    }

    get failed() {
        return this.promiseWrap_.rejected;
    }

    setStatus_(status) {
        this.stream.write(status);
    }

    // should be called at end of subclass constructor
    onInitialization_() {
        this.setStatus_(this.initializationStatus_());
    }

    onStart() {
        this.setStatus_(this.startStatus_());
        this.startTime_ = Date.now();
    }

    onProgress(downloadedSize, totalSize, ...additionalParameters) {
        let floatDownloaded = downloadedSize / totalSize;
        let secondsPassed = this.secondsPassed_;
        let estimatedTimeRemaining = secondsPassed / floatDownloaded - secondsPassed;

        let percent = Status.percentFormat_(floatDownloaded);
        let size = Status.sizeFormat_(totalSize);
        let time = Status.timeFormat_(estimatedTimeRemaining);

        this.setStatus_(this.progressStatus_(percent, time, size, ...additionalParameters));
    }

    onSuccess() {
        let time = Status.timeFormat_(this.secondsPassed_);
        this.setStatus_(this.successStatus_(time));
        this.promiseWrap_.resolve();
    }

    onFail(error) {
        this.setStatus_(this.failureStatus_(error));
        this.promiseWrap_.reject(error);
    }

    get secondsPassed_() {
        return (Date.now() - this.startTime_ || 0) / 1000;
    }

    static percentFormat_(percent) {
        return `${(percent * 100).toFixed(2)}%`;
    }

    static sizeFormat_(size) {
        return `${(size / 1024 / 1024).toFixed(2)} MB`;
    }

    static timeFormat_(time) {
        if (time < 3 * 60) // 3 minutes
            return `${time.toFixed(2)} seconds`;
        else if (time < 3 * 60 * 60) // 3 hours
            return `${(time / 60).toFixed(2)} minutes`;
        return `${(time / 60 / 60).toFixed(2)} hours`;
    }

    initializationStatus_() {
        /* abstract */
    }

    startStatus_() {
        /* abstract */
    }

    progressStatus_(percent, time, size, ...additionalParamters) {
        /* abstract */
    }

    successStatus_(time) {
        /* abstract */
    }

    failureStatus_(error) {
        /* abstract */
    }
}

module.exports = Status;
