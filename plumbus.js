const assets = {
    classes : {
        actuator : require("./source/actuator.js"),
        chest : require("./source/chest.js"),
        logger : require("./source/logger.js"),
        mysql : require("./source/mysql.js"),
        queue : require("./source/queue.js"),
        server : require("./source/server.js")
    },
    objects : {
        random : require("./source/random.js"),
        sync : require("./source/sync.js"),
        time : require("./source/time.js"),
        token : require("./source/token.js"),
        types : require("./source/types.js")
    }
};

const Plumbus = {};

for (let k in assets.classes) {
    let asset = assets.classes[k];
    Plumbus[k] = (...params) => {
        return new asset(...params);
    }
}

for (let k in assets.objects) {
    let asset = assets.objects[k];
    Plumbus[k] = () => {
        return asset;
    }
}

module.exports = Plumbus;