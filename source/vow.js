const Vow = {};

Vow.handle = function(promise) {
    if (!(promise instanceof Promise)) {
        throw new TypeError(`Value inserted is not a Promise`);
    }
    return promise.then(result => [null, result]).catch(error => [error, null]);
}

module.exports = Vow;
