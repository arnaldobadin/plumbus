const express = require("express");
const helmet = require("helmet");

const Server = function(port) {
	if (!(port && typeof(port) == "number" && port > 0 && port <= 65535)) {
		throw new Error("Invalid port on Server::Constructor.");
	}

	this._port = port;
	this._server = express();
	this._server.use(/^(?!\/raw-).*/, express.json());
	this._server.use(helmet());

	this._status = false;
}

Server.METHOD = {GET : "GET", POST : "POST"};

Server.prototype.start = function(callback) {
	callback = callback || (() => {});
	if (this._status) {
		callback("Server already is running.", null);
		return false;
	}

	this._status = true;
	this._server.listen(this._port, () => {callback(null, "Server started with success.");});
	return true;
}

Server.prototype.stop = function(callback) {
	callback = callback || (() => {});
	if (this._status) {
		callback("Server is not running.", null);
		return false;
	}

	this._status = false;
	this._server.close(() => {callback(null, "Server stopped with success.");});
	return true;
}

Server.prototype.route = function(path, method, callback) {
	if (!(path && typeof(path) == "string" && path.length)) {
		return false;
	}
	if (!(method && typeof(method) == "string" && method.length)) {
		return false;
	}
	if (!(callback && typeof(callback) == "function")) {
		return false;
	}

	switch (method) {
		case Server.METHOD.GET:
			this._server.get(path, callback);
			break;
		case Server.METHOD.POST:
			this._server.post(path, callback);
			break;
		default:
			return false;
	}
	return true;
}

module.exports = Server;
