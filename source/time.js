const Time = {};

Time.epoch = function() {
	return Math.floor(new Date() / 1000);
}

Time.local = function(time) {
	if (time != null) return new Date(
		new Date(time).toLocaleString(undefined, {hour12 : false}) + "Z"
	);
	return new Date(new Date().toLocaleString(undefined, {hour12 : false}) + "Z");
}

module.exports = Time;
