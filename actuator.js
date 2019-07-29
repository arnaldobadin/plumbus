const Actuator = function() {
	this.actions = {};
}

Actuator.prototype.set = function(name, callback) {
	if (!(name && typeof(name) == "string" && name.length)) {
		return false;
	}

	if (!callback && typeof(callback) == "function") {
		return false;
	}

	this.actions[name] = callback;
	return true;
}

Actuator.prototype.get = function(name) {
	return this.actions[name] || false;
}

Actuator.prototype.execute = function(name, ...args) {
	const action = this.get(name);
	if (!action) return false;

	action.apply(this, args);
	return true;
}

module.exports = Actuator;
