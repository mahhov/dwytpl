const $tream = require('bs-better-stream');

class ProgressTracker {
    constructor(progressSize) {
        this.progressStream = $tream();
        this.messageStream = $tream();
        this.progressLines_ = [];
        this.removedProgressLines_ = [];
        this.messageLines_ = [];
    }

    setProgressLine(index, line) {
        this.progressLines_[index] = line;
        this.updateProgressStream_();
    }

    removeProgressLine(index) {
        this.removedProgressLines_.push(index);
        this.addMessageLine_(this.progressLines_[index]);
        this.updateProgressStream_();
    }

    addMessageLine_(line) {
        this.messageLines_.push(line);
        this.updateMessageStreams_();
    }

    updateProgressStream_() {
        let progress = this.progressLines_
            .filter((_, i) => !this.removedProgressLines_.includes(i));
        this.progressStream.write(progress);
    }

    updateMessageStreams_() {
        this.messageStream.write(this.messageLines_);
    }

    static padText(text, maxLength = 45, whitespace = 5) {
        return text.slice(0, maxLength).padEnd(maxLength + whitespace);
    }
}

module.exports = ProgressTracker;
