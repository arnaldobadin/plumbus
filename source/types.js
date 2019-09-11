const Types = {};

Types.NUMBER = "number";
Types.STRING = "string";
Types.OBJECT = "object";
Types.ARRAY = "array";
Types.FUNCTION = "function";

Types.isType = function(value, type) {
	if (!(value != null && type != null)) return false;
	return value.constructor.name.toLowerCase() === type.toLowerCase();
}

Types.isRawType = function(value, type) {
	if (!(value != null && type != null)) return false;
	return typeof(value) === type.toLowerCase();
}

Types.getType = function(value) {
	if (value == null) return false;
	return value.constructor.name.toLowerCase();
}

Types.isValid = function(value) {
	if (value == null) return false;
	
	const type = Types.getType(value);
	if (type == Types.NUMBER || type == Types.FUNCTION) return true;

	let length = value.length;
	if (type == Types.OBJECT) length = Object.keys(value).length;

	if (!length) return false;
	return true;
}

Types.isInteger = function(value) {
	if (!Types.isType(value, Types.NUMBER)) return false;
	if (isNaN(value)) return false;
	if (value < 0) return false;
	return true;
}

Types.isPort = function(value) {
	if (!Types.isType(value, Types.NUMBER)) return false;
	if (isNaN(value)) return false;
	if (value < 0 || value > 65535) return false;
	return true;
}

Types.isBool = function(value) {
	if (!Types.isType(value, Types.NUMBER)) return false;
	if (isNaN(value)) return false;
	if (!(value == 0 || value == 1)) return false;
	return true;
}

Types.isComplete = function(object, keys) {
	if (Types.getType(object) != Types.OBJECT || !(Types.getType(keys) == Types.ARRAY && keys.length)) {
		return false;
	}

	for (let key of keys) {
		if (!Types.isValid(object[key])) {
			return false;
		}
	}
	return true;
}

Types.isInside = function(list, value) {
	if (!(Types.isType(list, Types.ARRAY) || Types.isType(list, Types.OBJECT))) return false;
	if (!Types.isValid(value)) return false;

	for (let k in list) {
		let item = list[k];
		if (value == item) return true;
	}

	return false;
}

module.exports = Types;
