const PromiseCreator = require('./PromiseCreator');
const $tream = require('bs-better-stream');

class Status {
    constructor() {
        this.stream = $tream();
        this.promise = new PromiseCreator();
    }

    setStatus(status) {
        this.stream.write(status);
    }

    // should be called at end of subclass constructor
    onInitialization() {
        this.setStatus(this.initializationStatus());
    }

    onStart() {
        this.setStatus(this.startStatus());
        this.startTime = Date.now();
    }

    onProgress(downloadedSize, totalSize, ...additionalParamters) {
        let floatDownloaded = downloadedSize / totalSize;
        let secondsPassed = this.secondsPassed_;
        let estimatedTimeRemaining = secondsPassed / floatDownloaded - secondsPassed;

        let percent = Status.percentFormat(floatDownloaded);
        let size = Status.sizeFormat(totalSize);
        let time = Status.timeFormat(estimatedTimeRemaining);

        this.setStatus(this.progressStatus(percent, time, size, ...additionalParamters));
    }

    onSuccess() {
        let time = Status.timeFormat(this.secondsPassed_);
        this.setStatus(this.successStatus(time));
        this.promise.resolve();
    }

    onFail() {
        this.setStatus(this.failureStatus());
        this.promise.reject();
    }

    get secondsPassed_() {
        return (Date.now() - this.startTime) / 1000;
    }

    static percentFormat(percent) {
        return `${(percent * 100).toFixed(2)}%`;
    }

    static sizeFormat(size) {
        return `${(size / 1024 / 1024).toFixed(2)} MB`;
    }

    static timeFormat(time) {
        if (time < 3 * 60) // 3 minutes
            return `${time.toFixed(2)} seconds`;
        else if (time < 3 * 60 * 60) // 3 hours
            return `${(time / 60).toFixed(2)} minutes`;
        return `${(time / 60 / 60).toFixed(2)} hours`;
    }

    initializationStatus() { /* abstract */
    }

    startStatus() { /* abstract */
    }

    progressStatus(percent, time, size, ...additionalParamters) { /* abstract */
    }

    successStatus(time) { /* abstract */
    }

    failureStatus() { /* abstract */
    }
}

module.exports = Status;
