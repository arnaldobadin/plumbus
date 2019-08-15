const mysql = require("mysql");
const fs = require("fs");

const Mysql = function(host, user, password) {
	if (!(host && typeof(host) == "string" && host.length)) throw new Error("Missing host on Mysql::Constructor.");
	if (!(user && typeof(user) == "string" && user.length)) throw new Error("Missing user on Mysql::Constructor.");
	if (!(password && typeof(password) == "string" && password.length)) throw new Error("Missing password on Mysql::Constructor.");

	this.config = {host, user, password, multipleStatements : true};
	this.pool = null;

	this.status = false;
}

Mysql.prototype.open = function(database, callback) {
	callback = callback || (() => {});

	if (this.status) return callback("Can't open another pool.", null);
	this.status = true;

	if (!(database && typeof(database) == "string" && database.length)) {
		return callback("Invalid or missing database.", null);
	}

	this.config.database = database;
	this.config.connectionLimit = 99;

	this.pool = mysql.createPool(this.config);
	return callback(null, true);
}

Mysql.prototype.close = function(callback) {
	callback = callback || (() => {});

	if (!(this.status)) return callback("Can't close an empty pool.", null);;
	this.status = false;

	this.config = null;
	this.pool.end();
	return callback(null, true);
}

Mysql.prototype.schema = function(path, callback) {
	callback = callback || (() => {});

	if (this.status) return callback("Too late to create schema.", null);
	if (!(path && typeof(path) == "string" && path.length)) {
		return callback("Missing path.", null);
	}

	let schema = fs.readFileSync(path, "utf8");

	if (!(schema && typeof(schema) == "string" && schema.length)) {
		return callback("Missing schema.", null);
	}

	let connection = mysql.createConnection(this.config);
	if (!connection) return callback("Missing connection.", null);

	return connection.connect(
		(error) => {
			if (error) return callback(error || "Unknown error", null);
			return connection.query(schema,
				(error, result, fields) => {
					connection.end();
					if (error) return callback(error, null);
					return callback(null, result);
				}
			);
		}
	);
}

Mysql.prototype.query = function(query, callback) {
	callback = callback || (() => {});

	if (!this.status) return callback("Can't query an empty pool.", null);
	if (!query) return callback("Missing query.", null);

	return this.pool.getConnection(
		(error, connection) => {
			if (error) return callback(error, null);
			if (!connection) return callback("Missing connection.", null);

			return connection.query(query,
				(error, result, fields) => {
					connection.release();
					if (error) return callback(error, null);
					return callback(null, result);
				}
			);
		}
	);
}

module.exports = Mysql;
