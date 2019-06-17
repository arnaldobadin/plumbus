const crypto = require("crypto");

const Token = function() {}

Token.CHARACTERS = "QWERTYUIOPASDFGHJKLÇZXCVBNMçabcdefghijklmnopqrstuvwxyz1234567890!@#$%&*()_-+=;:><.,?{}][";
Token.SIMPLE_CHARACTERS = "QWERTYUIOPASDFGHJKLZXCVBNMabcdefghijklmnopqrstuvwxyz1234567890";

Token.create = function(length, url_safe = false) {
    let uid = null;
    
    if (url_safe) {
        uid = Token.getToken(Token.SIMPLE_CHARACTERS, "sha1", length);
        uid = uid.replace(/\+/gi, "-").replace(/\//g, "_").replace(/=+$/, "o");
        return uid;
    }

    uid = Token.getToken(Token.CHARACTERS, "sha512", length);
    return uid;
}

Token.getToken = function(characters, code, length) {
    if (!(characters && characters.length && code && code.length && length)) return false;

    let char_len = characters.length;
    let uid = "";
    
    for (let i = 0; i < length; i++) {
        let index = Math.floor(Math.random() * char_len);
        uid += characters[index];
    }
    
    if (!(uid && uid.length)) return false;
    
    const hash = crypto.createHash(code);
    hash.update(uid, "utf-8");
    
    uid = hash.digest("base64");
    return uid;
}

module.exports = Token;