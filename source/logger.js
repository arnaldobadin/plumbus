const fs = require("fs");

const Logger = function(path = "./", file = "default", extension = ".txt") {
	this._path = path;
	this._file = file;
	this._extension = extension;
}

Logger.COLOR = {
    reset : "\x1b[0m", bright : "\x1b[1m", dim : "\x1b[2m", underscore : "\x1b[4m",
    blink : "\x1b[5m", reverse : "\x1b[7m", hidden : "\x1b[8m",

    fgblack : "\x1b[30m", fgred : "\x1b[31m", fggreen : "\x1b[32m", fgyellow : "\x1b[33m",
    fgblue : "\x1b[34m", fgmagenta : "\x1b[35m", fgcyan : "\x1b[36m", fgwhite : "\x1b[37m",

    bgblack : "\x1b[40m", bgred : "\x1b[41m", bggreen : "\x1b[42m", bgyellow : "\x1b[43m",
    bgblue : "\x1b[44m", bgmagenta : "\x1b[45m", bgcyan : "\x1b[46m", bgwhite : "\x1b[47m"
};

Logger.TYPE = {
	info : {symbol : "^", color : Logger.COLOR.fgwhite},
	warning : {symbol : "!", color : Logger.COLOR.fgyellow},
	event : {symbol : "#", color : Logger.COLOR.fgyellow},
	debug : {symbol : "$", color : Logger.COLOR.fgred},
	in : {symbol : ">", color : Logger.COLOR.fgcyan},
	out : {symbol : "<", color : Logger.COLOR.fgmagenta},
	error : {symbol : "*", color : Logger.COLOR.fgred},
	fail : {symbol : "-", color : Logger.COLOR.fgred},
	success : {symbol : "+", color : Logger.COLOR.fggreen},
	log : {symbol : "x", color : Logger.COLOR.fgwhite, hidden : true}
};

Logger.prototype._createStream = function(path) {
	if (!fs.existsSync(path)) fs.writeFileSync(path, "", "utf8");
	return this._stream = fs.createWriteStream(path, {flags : "a+", encoding : "utf8"});
}

Logger.prototype._closeStream = function() {
	if (!this._stream) return false;
	return this._stream.close();
}

for (let index in Logger.TYPE) {
	const type = Logger.TYPE[index];

	if (!type) continue;

	Logger.prototype[index] = function(message, ...params) {
		const now = new Date();

		if (!this._stream) {
			this._createStream(this._path + this._file + "-" + now.toISOString() + this._extension);
		}

		if (!type.hidden) {
			let log = type.color + "[" + type.symbol + "] " + message + Logger.COLOR.reset;
			console.log(log);

			for (let k in params) {
				console.log(params[k]);
			}
		}

		log = now.toISOString() + " -> " + "[" + type.symbol + "] " + message + "\n";
		return this._stream.write(log);
	}
}

module.exports = Logger;