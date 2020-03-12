const mssql = require("mssql");
const fs = require("fs");

const Client = function(host, user, password) {
	if (!(host && typeof(host) == "string" && host.length)) throw new Error("Missing host on Client::Constructor");
	if (!(user && typeof(user) == "string" && user.length)) throw new Error("Missing user on Client::Constructor");
	if (!(password && typeof(password) == "string" && password.length)) throw new Error("Missing password on Client::Constructor");

	this._config = {server : host, user, password};
	this._pool = null;

	this._connected = false;
	this._status = false;
}

Client.prototype.connected = function() {
	return this._connected;
}

Client.prototype.open = async function(database) {
	if (this._status) throw new Error(`Can't open another pool`);
	this._status = true;

	if (!(database && typeof(database) == "string" && database.length)) {
		throw new Error(`Invalid or missing database`);
	}

	this._config.database = database;
	this._config.requestTimeout = 15 * 60 * 1000;
	this._config.options = {enableArithAbort : true};
	this._config.pool = {max : 99, min : 0, idleTimeoutMillis : 3000};

	this._pool = new mssql.ConnectionPool(this._config);
	if (!this._pool._connected) {
		try {await this._pool.connect();}
        catch (error) {throw new Error(`Pool failed on connect: '${error}'`);}
    }

	this._connected = true;
	return `Pool created with success`;
}

Client.prototype.close = async function() {
	if (!(this._status)) throw new Error(`Can't close an empty pool`);
	this._status = false;

	this._config = null;
	this._pool.close();

	this._connected = false;
	return `Pool closed with success`;
}

Client.prototype.query = async function(query) {
	if (!this._status) throw new Error(`Can't query an empty pool`);
	if (!(query && typeof(query) == "string" && query.length)) {
		throw new Error(`Invalid/missing query`);
	}
    
	return await new Promise((resolve, reject) => {
		const request = this._pool.request();
        return request.query(query, (error, result) => {
            if (error || !result) return reject(new Error(error));
            if (result && !result.recordset) return resolve(true);
            return resolve(result.recordset);
        });
    });
}

Client.prototype.bulk = async function(table) {
	if (!this._status) throw new Error(`Can't query an empty pool`);
	if (!(table instanceof mssql.Table)) {
		throw new Error(`Invalid/missing mssql.Table instance`);
	}

	return await new Promise((resolve, reject) => {
		const request = this._pool.request();
        return request.bulk(table, (error, result) => {
            if (error || !result) return reject(new Error(error));
            if (result && !result.recordset) return resolve(true);
            return resolve(result.recordset);
        });
    });
}

Client.prototype.stream = async function(query, stream) {
	if (!this._status) throw new Error(`Can't query an empty pool`);
	if (!(query && typeof(query) == "string" && query.length)) {
		throw new Error(`Invalid/missing query.`);
	}
	if (!stream instanceof fs.WriteStream) {
		throw new Error("Invalid or missing fs.WriteStream instance");
	}

	const request = this._pool.request();
	request.stream = true;
	request.query(query);

	let count = 0;
	request.on("row", (row) => {
		count++;
		stream.write(JSON.stringify(row) + "\n");
	});

	return new Promise((resolve, reject) => {
		request.on("error", (error) => {reject(error);});
		request.on("done", (result) => {
			stream.end();
			request.stream = false;
			resolve(count);
		});
	});
}

module.exports = {
	Client, Table : mssql.Table, TYPES : mssql.TYPES
};
