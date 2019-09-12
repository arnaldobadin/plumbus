const Check = {};

Check.inside = function(array, value) {
    if (!(array != null && Array.isArray(array) && value != null)) {
        return false;
    }
    for (let k in array) {
        let item = array[k];
        if (item == value && typeof(item) == typeof(value)) return true;
        if (Check.inside(item, value)) {
            return true;
        }
    }
    return false;
}

Check.struct = function(object, fields) {
    if (!(object != null && !Array.isArray(object) && typeof(object) == "object")) {
        return false;
    }
    if (!(fields != null && Array.isArray(fields) && fields.length)) {
        return false;
    }

    for (let k in fields) {
        const field = fields[k];
        if (!(field && typeof(field) == "string" && field.length)) {
            continue;
        }

        const items = field.split(/\./gi);
        
        let result = object;
        for (let i = 0; i < items.length; i++) {
            result = result[items[i]];
            if (result == null) return false;
        }
    }
    return true;
}

module.exports = Check;