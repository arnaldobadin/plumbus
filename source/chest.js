const Chest = function() {
	this._data = {};
};

Chest.prototype.set = function(path, value) {
	if (!path) return false;
	return this._data[path] = value;
}

Chest.prototype.get = function(path) {
	if (!path) return false;
	return this._data[path] || false;
}

Chest.prototype.unpack = function() {
	return this._data;
}

Chest.prototype.clear = function(path) {
	if (!path) return this._data = {};
	return this._data[path] = null;
}

module.exports = Chest;
