const mysql = require("mysql");
const fs = require("fs");

const Mysql = function(host, user, password) {
	if (!(host && typeof(host) == "string" && host.length)) throw new Error("Missing host on Mysql::Constructor.");
	if (!(user && typeof(user) == "string" && user.length)) throw new Error("Missing user on Mysql::Constructor.");
	if (!(password && typeof(password) == "string" && password.length)) throw new Error("Missing password on Mysql::Constructor.");

	this._config = {host, user, password, multipleStatements : true};
	this._pool = null;

	this._connected = false;
	this._status = false;
}

Mysql.QUERY = {};
Mysql.QUERY.STATUS = `SELECT 1;`;

Mysql.prototype.connected = function() {
	return this._connected;
}

Mysql.prototype.open = async function(database) {
	if (this._status) return new Error(`Can't open another pool.`);
	this._status = true;

	if (!(database && typeof(database) == "string" && database.length)) {
		return new Error(`Invalid or missing database.`);
	}

	this._config.database = database;
	this._config.connectionLimit = 99;

	this._pool = mysql.createPool(this._config);
	if (!this._pool) return new Error(`Failed on creating pool.`);

	const status = await this.query(Mysql.QUERY.STATUS);
	if (status instanceof Error) return new Error(`Pool failed on connect: ${status}`);

	this._connected = true;
	return `Pool created with success.`;
}

Mysql.prototype.close = async function() {
	if (!(this._status)) return new Error(`Can't close an empty pool.`);
	this._status = false;

	this._config = null;
	this._pool.end();

	this._connected = false;
	return `Pool closed with success.`;
}

Mysql.prototype.query = async function(query) {
	if (!this._status) return new Error(`Can't query an empty pool.`);
	if (!(query && typeof(query) == "string" && query.length)) {
		return new Error(`Missing query.`);
	}
	
	return await new Promise((resolve, reject) => {
        return this._pool.getConnection((error, connection) => {
            if (error) return resolve(new Error(error));
            if (!connection) return resolve(
                new Error(`Can't get a valid connection.`)
            );

            return connection.query(query, (error, result, fields) => {
                connection.release();
                if (error) return resolve(new Error(error));
                return resolve(result);
            });
        });
    });
}

module.exports = Mysql;
