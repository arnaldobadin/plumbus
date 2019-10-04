const crypto = require("crypto");

const Hash = {};

Hash.CHARACTER = {};
Hash.CHARACTER.NORMAL = (
    "QWERTYUIOPASDFGHJKLÇZXCVBNMçabcdefghijklmnopqrstuvwxyz1234567890!@#$%&*()_-+=;:><.,?{}]["
);
Hash.CHARACTER.SAFE = (
    "QWERTYUIOPASDFGHJKLZXCVBNMabcdefghijklmnopqrstuvwxyz1234567890"
);

Hash.create = function(length, safe = false) {
    if (safe) {
        const token = Hash._generate(Hash.CHARACTER.SAFE, "sha512", length);
        if (!token) return false;
        return token.replace(/\+/gi, "-").replace(/\//gi, "_").replace(/=/gi, "o");
    }
    return Hash._generate(Hash.CHARACTER.NORMAL, "sha512", length);
}

Hash.extract = function(data) {
    if (!(data && typeof(data) == "string" && data.length)) {
        return false;
    }

    const hash = crypto.createHash("sha512");
    hash.update(data, "utf-8");

    return hash.digest("base64");
}

Hash._generate = function(characters, code, length) {
    if (!(characters && characters.length && code && code.length && length)) return false;

    let uid = "";

    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * characters.length);
        uid += characters[index];
    }
    
    if (!(uid && uid.length)) return false;
    
    const hash = crypto.createHash(code);
    hash.update(uid, "utf-8");

    return hash.digest("base64");
}

module.exports = Hash;
