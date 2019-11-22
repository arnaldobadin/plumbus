const Types = {};

Types.DATATYPE = {
	NUMBER : "number", STRING : "string",
	OBJECT : "object", ARRAY : "array", FUNCTION : "function",
	ERROR : "error", SYMBOL : "symbol"
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
	return (value % 1) === 0;
}

Types.float = function(value) {
	if (value == null) return false;
	if (!Types.number(value)) return false;
	return (value % 1) !== 0;
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

Types.instance = function(value, type) {
	if (!(value != null && type != null)) return false;
	if (!Types.string(type)) return false;
	return value.constructor.name.toLowerCase() == type.toLowerCase();
}

Types.function = function(value) {
	if (value == null) return false;
	return typeof(value) == Types.DATATYPE.FUNCTION;
}

Types.symbol = function(value) {
	if (value == null) return false;
	return typeof(value) == Types.DATATYPE.SYMBOL;
}

Types.error = function(value) {
	if (value == null) return false;
	return value.constructor.name.toLowerCase() == Types.DATATYPE.ERROR;
}

Types.date = function(value) {
	if (value == null) return false;
	const date = new Date(value);
	return (value != "Invalid Date" && !isNaN(date));
}

module.exports = Types;
