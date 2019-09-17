const assets = {
    classes : {
        Actuator : require("./source/actuator.js"),
        Chest : require("./source/chest.js"),
        Logger : require("./source/logger.js"),
        Mysql : require("./source/mysql.js"),
        Queue : require("./source/queue.js"),
        Server : require("./source/server.js")
    },
    objects : {
        random : require("./source/random.js"),
        check : require("./source/check.js"),
        sync : require("./source/sync.js"),
        time : require("./source/time.js"),
        hash : require("./source/hash.js"),
        types : require("./source/types.js")
    }
};

const Plumbus = {};

for (let k in assets) {
    for (let v in assets[k]) {
        Plumbus[v] = () => {
            return assets[k][v];
        }
    }
}

module.exports = Plumbus;
