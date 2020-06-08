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

Vow.lock = function() {
    const lock = {};
    lock._promise = new Promise((resolve, reject) => {
        lock._resolve = resolve;
        lock._reject = reject;
    });

    lock.wait = () => lock._promise;
    lock.release = () => lock._resolve();
    return lock;
}

module.exports = Vow;
