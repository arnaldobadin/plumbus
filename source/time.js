const Time = {};

Time.epoch = function() {
	return Math.floor(new Date() / 1000);
}

module.exports = Time;
