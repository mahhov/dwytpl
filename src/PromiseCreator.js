class PromiseCreator {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve_ = resolve;
            this.reject_ = reject;
        });
    }

    get determined_() {
        return this.resolved || this.rejected;
    }

    resolve() {
        if (this.determined_)
            return;
        this.resolved = true;
        this.resolve_();
    }

    reject() {
        if (this.determined_)
            return;
        this.rejected = true;
        this.reject_();
    }
}

module.exports = PromiseCreator;
