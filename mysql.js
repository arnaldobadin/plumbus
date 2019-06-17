const mysql = require("mysql");

const Mysql = function(host, user, password, database) {
    if (!(host && typeof(host) == "string" && host.length)) throw new Error("Missing host on Mysql::Constructor.");
    if (!(user && typeof(user) == "string" && user.length)) throw new Error("Missing user on Mysql::Constructor.");
    if (!(password && typeof(password) == "string" && password.length)) throw new Error("Missing password on Mysql::Constructor.");
    if (!(database && typeof(database) == "string" && database.length)) throw new Error("Missing database on Mysql::Constructor.");
    
    this.config = {host, user, password, database, multipleStatements : true, connectionLimit : 99};
    this.pool = mysql.createPool(this.config);
}

Mysql.prototype.close = function() {
    if (!(this.pool)) return false;
    return this.pool.end();
}

Mysql.prototype.insert = function(table, data, callback) {
    callback = callback || (() => {});
    if (!(table && data)) return callback("Missing data.", null);

    let fields = [];
    let values = [];

    for (let k in data) {
        let row = data[k];

        if (!(k && row)) continue;
        if (typeof(row) != "string" && typeof(row) != "number") continue;
        if (typeof(row) == "string") row = "'" + row + "'";

        fields.push("`" + k + "`");
        values.push(row);
    }

    fields = fields.join(",");
    values = values.join(",");

    const query = `INSERT INTO ${table} (${fields}) VALUES (${values});`;
    return this.pool.query(query, callback);
}

Mysql.prototype.query = function(query, callback) {
    callback = callback || (() => {});
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