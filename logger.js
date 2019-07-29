const fs = require("fs");
const moment = require("moment");

const Logger = function(path = "./", file = "default", extension = ".txt") {
	this.path = __dirname + path;
	this.file = file;
	this.extension = extension;
	this.time = moment();
}

Logger.COLORS = {
    reset : "\x1b[0m", bright : "\x1b[1m", dim : "\x1b[2m", underscore : "\x1b[4m",
    blink : "\x1b[5m", reverse : "\x1b[7m", hidden : "\x1b[8m",

    fgblack : "\x1b[30m", fgred : "\x1b[31m", fggreen : "\x1b[32m", fgyellow : "\x1b[33m",
    fgblue : "\x1b[34m", fgmagenta : "\x1b[35m", fgcyan : "\x1b[36m", fgwhite : "\x1b[37m",

    bgblack : "\x1b[40m", bgred : "\x1b[41m", bggreen : "\x1b[42m", bgyellow : "\x1b[43m",
    bgblue : "\x1b[44m", bgmagenta : "\x1b[45m", bgcyan : "\x1b[46m", bgwhite : "\x1b[47m"
};

Logger.LOGTYPES = {
	info : {symbol : "^", color : Logger.COLORS.fgwhite},
	warning : {symbol : "!", color : Logger.COLORS.fgyellow},
	event : {symbol : "#", color : Logger.COLORS.fgyellow},
	debug : {symbol : "$", color : Logger.COLORS.fgred},
	in : {symbol : ">", color : Logger.COLORS.fgcyan},
	out : {symbol : "<", color : Logger.COLORS.fgmagenta},
	error : {symbol : "*", color : Logger.COLORS.fgred},
	fail : {symbol : "-", color : Logger.COLORS.fgred},
	success : {symbol : "+", color : Logger.COLORS.fggreen},
	log : {symbol : "x", color : Logger.COLORS.fgwhite, hidden : true}
};

Logger.prototype.createStream = function(path) {
	if (!fs.existsSync(path)) fs.writeFileSync(path, "", "utf8");
	return this.stream = fs.createWriteStream(path, {flags : "a+", encoding : "utf8"});
}

Logger.prototype.closeStream = function() {
	if (!this.stream) return false;
	return this.stream.close();
}

for (let index in Logger.LOGTYPES) {
	const type = Logger.LOGTYPES[index];

	if (!type) continue;

	Logger.prototype[index] = function(message, ...params) {
		let now = moment();
		let before = this.time;

		if (now.format("YYYY-MM-DD") != before.format("YYYY-MM-DD")) this.time = now;

		if (!this.stream) {
			this.createStream(this.path + this.file + "-" + this.time.format("YYYY-MM-DD") + this.extension);
		}

		if (!type.hidden) {
			let log = type.color + "[" + type.symbol + "] " + message + Logger.COLORS.reset;
			console.log(log);

			for (let k in params) {
				console.log(params[k]);
			}
		}

		log = now.format("YYYY-MM-DD HH:mm:ss") + " -> " + "[" + type.symbol + "] " + message + "\n";
		return this.stream.write(log);
	}
}

module.exports = Logger;
