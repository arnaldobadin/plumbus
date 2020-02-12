const Types = {};

Types.DATATYPE = {
	NUMBER : "number", STRING : "string", OBJECT : "object",
    	ARRAY : "array", FUNCTION : "function", ERROR : "error",
    	SYMBOL : "symbol"
};

Types.string = function(value) {
	return typeof(value) === Types.DATATYPE.STRING || value instanceof String;
}

Types.number = function(value) {
	return typeof(value) === Types.DATATYPE.NUMBER && Number.isFinite(value);
}

Types.bool = function(value) {
	return Types.number(value) && (value === 0 || value === 1);
}

Types.integer = function(value) {
	return Types.number(value) && Number.isInteger(value);
}

Types.float = function(value) {
	return Types.number(value) && ((value % 1) !== 0);
}

Types.port = function(value) {
	return Types.number(value) && (value >= 0 && value <= 65535);
}

Types.array = function(value) {
	return value != null && typeof(value) === Types.DATATYPE.OBJECT && value.constructor === Array;
}

Types.object = function(value) {
	return value != null && typeof(value) === Types.DATATYPE.OBJECT && value.constructor === Object;
}

Types.function = function(value) {
	return typeof(value) === Types.DATATYPE.FUNCTION;
}

Types.symbol = function(value) {
	return typeof(value) == Types.DATATYPE.SYMBOL;
}

Types.error = function(value) {
	return value instanceof Error;
}

Types.date = function(value) {
	return value instanceof Date;
}

Types.instance = function(value, type) {
    return (value != null && type != null) && ((typeof(type) === Types.DATATYPE.FUNCTION && value.constructor === type) || value.constructor.name === type);
}

module.exports = Types;
