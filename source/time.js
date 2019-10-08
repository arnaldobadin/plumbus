const Time = {};

Time.epoch = function() {
	return Math.floor(new Date() / 1000);
}

Time.now = function() {
	new Date(new Date().toLocaleString(undefined, {hour12 : false}) + "Z");
}

module.exports = Time;
