const Types = {};

Types.DATATYPE = {
	NUMBER : "number", STRING : "string",
	OBJECT : "object", ARRAY : "array", FUNCTION : "function"
};

Types.string = function(value) {
	if (value == null) return false;
	return typeof(value) == Types.DATATYPE.STRING;
}

Types.number = function(value) {
	if (value == null) return false;
	if (isNaN(value)) return false;
	return typeof(value) == Types.DATATYPE.NUMBER;
}

Types.bool = function(value) {
	if (value == null) return false;
	if (!Types.number(value)) return false;
	return value >= 0 && value <= 1;
}

Types.integer = function(value) {
	if (value == null) return false;
	if (!Types.number(value)) return false;
	return value >= 0;
}

Types.port = function(value) {
	if (value == null) return false;
	if (!Types.number(value)) return false;
	return value >= 0 && value <= 65535;
}

Types.array = function(value) {
	if (value == null) return false;
	return Array.isArray(value);
}

Types.object = function(value) {
	if (value == null) return false;
	if (Types.array(value)) return false;
	return typeof(value) == Types.DATATYPE.OBJECT;
}

Types.function = function(value) {
	if (value == null) return false;
	return typeof(value) == Types.DATATYPE.FUNCTION;
}

module.exports = Types;