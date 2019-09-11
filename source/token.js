const crypto = require("crypto");

const Token = {};

Token.CHARACTER = {};
Token.CHARACTER.NORMAL = (
    "QWERTYUIOPASDFGHJKLÇZXCVBNMçabcdefghijklmnopqrstuvwxyz1234567890!@#$%&*()_-+=;:><.,?{}]["
);
Token.CHARACTER.SAFE = (
    "QWERTYUIOPASDFGHJKLZXCVBNMabcdefghijklmnopqrstuvwxyz1234567890"
);

Token.create = function(length, safe = false) {
    if (safe) {
        const token = Token._generate(Token.CHARACTER.SAFE, "sha1", length);
        if (!token) return false;
        return token.replace(/\+/gi, "-").replace(/\//g, "_").replace(/=+$/, "o");
    }
    return Token._generate(Token.CHARACTER.NORMAL, "sha512", length);
}

Token._generate = function(characters, code, length) {
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

module.exports = Token;