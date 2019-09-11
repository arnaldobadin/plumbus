const Actuator = function() {
	this._actions = {};
}

Actuator.prototype.set = function(name, callback) {
	if (!(name && typeof(name) == "string" && name.length)) {
		return false;
	}

	if (!callback && typeof(callback) == "function") {
		return false;
	}

	this._actions[name] = callback;
	return true;
}

Actuator.prototype.get = function(name) {
	return this._actions[name] || false;
}

Actuator.prototype.execute = function(name, ...args) {
	const action = this.get(name);
	if (!action) return false;

	return action.apply(this, args);
}

module.exports = Actuator;
