const Interface = function(map = {}) {
    this._map = map;
}

Interface.prototype.get = function(key) {
    if (!(key != null && typeof(key) == "string" && key.length)) {
        return false;
    }
    return this._map[key];
}

Interface.prototype.set = function(key, value) {
    if (!(key != null && typeof(key) == "string" && key.length)) {
        return false;
    }
    if (value == null) return false;

    if (typeof(this[key]) === "undefined" && typeof(this._map[key]) === "undefined") {
        Object.defineProperty(this, key, {
            get(val) {return this._map[key];},
            set(val) {return this._map[key] = val;}
        });
    }

    this._map[key] = value;
    return true;
}

Interface.prototype.match = function(value) {
    if (value == null) return false;
    for (let k in this._map) {
        const locum = this._map[k];
        if (locum === value) return true;
    }
    return false;
}

Interface.prototype.join = function(delim) {
    if (delim && typeof(delim) != "string") return false;
    delim = delim || "";

    const result = [];
    for (let k in this._map) {
        result.push(this._map[k]);
    }
    return result.join(delim);
}

Interface.prototype.entries = function() {
    return Object.entries(this._map);
}

const Instance = function() {
    this._map = {};
    this._interface = new Interface(this._map);
}

Instance.prototype.getMap = function() {return this._map;}
Instance.prototype.getInterface = function() {return this._interface;}

const Generator = function(options) {
    const instance = new Instance();
    const interface = instance.getInterface();

    for (let k in options) {
        interface.set(k, options[k]);
    }
    return interface;
}

module.exports = Generator;
