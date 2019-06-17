const Random = function() {}

Random.between = function(min, max) {
	if (!(min != null && typeof(min) == "number")) return false;
	if (!(max != null && typeof(max) == "number")) return false;

	min = Math.floor(min);
	max = Math.ceil(max);

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = Random;