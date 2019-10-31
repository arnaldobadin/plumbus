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

Mssql.prototype.open = async function(database) {
	if (this._status) return new Error(`Can't open another pool.`);
	this._status = true;

	if (!(database && typeof(database) == "string" && database.length)) {
		return new Error(`Invalid or missing database.`);
	}

	this._config.database = database;
	this._config.requestTimeout = 15 * 60 * 1000;
	this._config.pool = {max : 99, min : 0, idleTimeoutMillis : 3000};

	this._pool = new mssql.ConnectionPool(this._config);
	if (!this._pool._connected) {
		try {await this._pool.connect();}
        catch (error) {return new Error(`Pool failed on connect: ${error}`);}
    }

	this._connected = true;
	return `Pool created with success.`;
}

Mssql.prototype.close = async function() {
	if (!(this._status)) return new Error(`Can't close an empty pool.`);
	this._status = false;

	this._config = null;
	this._pool.close();

	this._connected = false;
	return `Pool closed with success.`;
}

Mssql.prototype.query = async function(query) {
	if (!this._status) return new Error(`Can't query an empty pool.`);
	if (!(query && typeof(query) == "string" && query.length)) {
		return new Error(`Invalid/missing query.`);
	}
    
	return await new Promise((resolve, reject) => {
        return this._pool.request().query(query, (error, result) => {
            if (error || !result) return resolve(new Error(error));
            if (result && !result.recordset) return resolve(true);
            return resolve(result.recordset);
        });
    });
}

module.exports = Mssql;
