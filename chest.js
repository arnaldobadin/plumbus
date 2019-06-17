const Chest = function() {
	this.data = {};
};

Chest.prototype.set = function(path, value) {
	if (!path) return false;
	return this.data[path] = value;
}

Chest.prototype.get = function(path) {
	if (!path) return false;
	return this.data[path];
}

Chest.prototype.unpack = function() {
	return this.data;
}

Chest.prototype.clear = function(path) {
	if (!path) return this.data = {};
	return this.data[path] = null;
}

module.exports = Chest;