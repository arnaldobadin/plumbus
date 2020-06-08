const Vow = {};

Vow.handle = function(promise) {
    if (!(promise instanceof Promise)) {
        throw new TypeError(`Value inserted is not a Promise`);
    }
    return promise.then(result => [null, result]).catch(error => [error, null]);
}

Vow.promise = function(callback) {
    if (!(callback && typeof(callback) == "function")) {
        throw new TypeError(`Value inserted is not a function`);
    }
    return Vow.handle(new Promise((resolve, reject) => {return callback(resolve, reject);}));
}

Vow.signal = function() {
    const signal = {_promise: null, _resolve: null};
    signal.wait = function() {
        if (this._promise || this._resolve) return false;
        return this._promise = new Promise((resolve, reject) => { 
            this._resolve = resolve;
        });
    };
    signal.send = function() {
        if (!(this._promise && this._resolve)) return false;
        return this._resolve();
    };
    return signal;
}

module.exports = Vow;
