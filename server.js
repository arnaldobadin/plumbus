const express = require("express");
const helmet = require("helmet");

const Server = function(port) {
	if (!(port && typeof(port) == "number" && port > 0 && port <= 65535)) {
		throw new Error("Invalid port on Server::Constructor.");
	}

	this.port = port;
	this.server = express();
	this.server.use(/\/((?!raw-input).)*/, express.json());
	this.server.use(helmet());

	this.status = false;
}

Server.METHODS = {GET : "GET", POST : "POST"};

Server.LAYOUTS = {
	ERROR : (code, message) => {
		const payload = {status : false, error : {}};
		if (code) payload.error.code = code;
		if (message) payload.error.message = message;
		return payload;
	},
	SUCCESS : (message) => {
		const payload = {status : true};
		if (message) payload.message = message;
		return payload;
	}
};

Server.prototype.start = function(callback) {
	callback = callback || (() => {});
	if (this.status) {
		callback("Server already is running.", null);
		return false;
	}

	this.status = true;
	this.server.listen(this.port, () => {callback(null, true);});
	return true;
}

Server.prototype.stop = function(callback) {
	callback = callback || (() => {});
	if (this.status) {
		callback("Server is not running.", null);
		return false;
	}

	this.status = false;
	this.server.close(() => {callback(null, true);});
	return true;
}

Server.prototype.setRoute = function(method, path, callback) {
	if (!(method && typeof(method) == "string" && method.length)) {
		return false;
	}

	if (!(path && typeof(path) == "string" && path.length)) {
		return false;
	}

	if (!(callback && typeof(callback) == "function")) {
		return false;
	}

	switch (method) {
		case Server.METHODS.GET:
			this.server.get(path, callback);
			break;
		case Server.METHODS.POST:
			this.server.post(path, callback);
		default:
			return false;
	}

	return true;
}

module.exports = Server;
