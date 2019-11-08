const Consumer = function(callback, interval) {
    if (!(callback != null && typeof(callback) == "function")) {
        throw new Error(`Callback must be a function.`);
    }
    if (!(interval != null && typeof(interval) == "number" && interval > 0)) {
        throw new Error(`Interval must be a number higher than 0.`);
    }

    this._callback = callback;
    this._interval = interval;

    this._state = Consumer.STATE.STOPPED;
    this._status = false;
}

Consumer.STATE = {};
Consumer.STATE.RUNNING = Symbol("running");
Consumer.STATE.STOPPED = Symbol("stopped");

Consumer.prototype.start = function() {
    if (this._status) return false;
    this._status = true;

    setImmediate(() => {return this._schedule();});
    return true;
}

Consumer.prototype.stop = function() {
    if (!this._status) return false;
    this._status = false;
    
    this._state = Consumer.STATE.STOPPED;
    return true;
}

Consumer.prototype._schedule = async function() {
    if (!this._status) return false;

    if (this._state == Consumer.STATE.STOPPED) {
        this._state = Consumer.STATE.RUNNING;
        setImmediate(() => {return this._consume();});
    }

    return setTimeout(() => {return this._schedule();}, this._interval);
}

Consumer.prototype._consume = async function() {
    if (this._state != Consumer.STATE.RUNNING) {
        return false;
    }

    const status = await this._callback();
    if (!(status && !(status instanceof Error))) {
        return this._state = Consumer.STATE.STOPPED;
    }

    return setImmediate(() => {return this._consume();});
}

module.exports = Consumer;
