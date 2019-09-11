const Actuator = require("./source/actuator.js");
const Chest = require("./source/chest.js");
const Logger = require("./source/logger.js");
const Mysql = require("./source/mysql.js");
const Queue = require("./source/queue.js");
const Server = require("./source/server.js");

const Random = require("./source/random.js");
const Sync = require("./source/sync.js");
const Time = require("./source/time.js");
const Token = require("./source/token.js");
const Types = require("./source/types.js");

const Plumbus = {
    actuator : (...params) => {return new Actuator(...params);},
    chest : (...params) => {return new Chest(...params);},
    logger : (...params) => {return new Logger(...params);},
    mysql : (...params) => {return new Mysql(...params);},
    queue : (...params) => {return new Queue(...params);},
    server : (...params) => {return new Server(...params);},

    random : () => {return Random;},
    sync : () => {return Sync;},
    time : () => {return Time;},
    token : () => {return Token;},
    types : () => {return Types;}
}

module.exports = Plumbus;