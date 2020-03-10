const fs = require("fs");

const ReadLine = function(path) {
    if (!(path && typeof(path) === "string" && path.length)) {
        throw new Error("Invalid or missing path field");
    }

    this._path = path;
}

ReadLine.prototype.readLine = async function(callback) {
    if (typeof(callback) !== "function") return false;

    const stream = fs.createReadStream(this._path, {
        encoding : "utf8", highWaterMark : 1024
    });
    
    let data = "";
    for await (const chunk of stream) {
        data += chunk;
        
        let eol_index;
        while ((eol_index = data.indexOf("\n")) >= 0) {
            const line = data.slice(0, eol_index);
            await callback(line);
            data = data.slice(eol_index + 1);
        }
    }

    if (data.length) {
        await callback(data);
    }
    return true;
}

ReadLine.prototype[Symbol.asyncIterator] = function() {
    const _stream = fs.createReadStream(this._path, {
        encoding : "utf8", highWaterMark : 1024
    });

    _iterator = _stream[Symbol.asyncIterator]();

    _data = "";
    _eol_index = -1;

    const next = async () => {
        if (_eol_index < 0) {
            const {done, value} = await _iterator.next();
            if (done) return {done : true};

            _data += value;
        }

        if ((_eol_index = _data.indexOf("\n")) >= 0) {
            const line = _data.slice(0, _eol_index);
            _data = _data.slice(_eol_index + 1);
            return {done : false, value : line};
        }
        return {done : false, value : _data};
    }

    return {next};
}

module.exports = ReadLine;
