const express = require("express");
const helmet = require("helmet");

const Server = function(port) {
	if (!(port && typeof(port) == "number" && port > 0 && port <= 65535)) {
		throw new Error("Invalid port on Server::Constructor.");
	}

	this.port = port;
	this.server = express();
	this.server.use(/^(?!\/raw-).*/, express.json());
	this.server.use(helmet());

	this.status = false;
}

Server.METHOD = {GET : "GET", POST : "POST"};

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

Server.prototype.route = function(method, path, callback) {
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
		case Server.METHOD.GET:
			this.server.get(path, callback);
			break;
		case Server.METHOD.POST:
			this.server.post(path, callback);
			break;
		default:
			return false;
	}

	return true;
}

module.exports = Server;
