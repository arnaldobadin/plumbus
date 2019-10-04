const mssql = require("mssql");

const Mssql = function(host, user, password) {
	if (!(host && typeof(host) == "string" && host.length)) throw new Error("Missing host on Mssql::Constructor.");
	if (!(user && typeof(user) == "string" && user.length)) throw new Error("Missing user on Mssql::Constructor.");
	if (!(password && typeof(password) == "string" && password.length)) throw new Error("Missing password on Mssql::Constructor.");

	this._config = {server : host, user, password};
	this._pool = null;

	this._connected = false;
	this._status = false;
}

Mssql.prototype.connected = function() {
	return this._connected;
}

Mssql.prototype.open = async function(database, callback) {
	callback = callback || (() => {});
	if (this._status) {
		return callback("Can't open another pool.", null);
	}
	this._status = true;

	if (!(database && typeof(database) == "string" && database.length)) {
		return callback("Invalid or missing database.", null);
	}

	this._config.database = database;
	this._config.pool = {
        max : 99,
        min : 0,
        idleTimeoutMillis : 3000
    };

	this._pool = new mssql.ConnectionPool(this._config);

	if (!this._pool._connected) {
		try {
			await this._pool.connect();
		} catch (error) {
			return callback(`Pool failed on connect: ${error}`, null);
		}
    }

	this._connected = true;
	return callback(null, "Pool created with success.");
}

Mssql.prototype.close = function(callback) {
	callback = callback || (() => {});
	if (!(this._status)) {
		return callback("Can't close an empty pool.", null);
	}
	this._status = false;

	this._config = null;
	this._pool.close();

	this._connected = false;
	return callback(null, "Pool closed with success.");
}

Mssql.prototype.query = async function(query, callback) {
	callback = callback || (() => {});

	if (!this._status) return callback("Can't query an empty pool.", null);
	if (!(query && typeof(query) == "string" && query.length)) {
		return callback("Invalid/missing query.", null);
	}

    return this._pool.request().query(query,
		(error, result) => {
			if (error || !result) return callback(error, null);
			if (result && !result.recordset) return callback(null, true);
			return callback(null, result.recordset);
		}
	);
}

module.exports = Mssql;
