const Event = function(name, callback, interval = false) {
	this.name = name;
	this.callback = callback;
	this.interval = interval;
}

Event.prototype.isValid = function() {
	return (this.name && typeof(this.name) == "string" && this.name.length && this.callback && typeof(this.callback) == "function");
}

Event.prototype.getName = function() {return this.name;}
Event.prototype.getCallback = function() {return this.callback;}
Event.prototype.getInterval = function() {return this.interval;}

Event.prototype.setName = function(value) {return this.name = value;}
Event.prototype.setCallback = function(value) {return this.callback = value;}
Event.prototype.setInterval = function(value) {return this.interval = value;}

module.exports = Event;