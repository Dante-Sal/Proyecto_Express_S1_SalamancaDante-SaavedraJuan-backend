const { ObjectId } = require('mongodb');

class GeneralUtils {
    static lowercase(value) {
        return value.toLowerCase();
    };

    static trimAll(object) {
        Object.keys(object).forEach(key => {
            if (typeof object[key] === 'string') object[key] = object[key].trim();
        });

        return object;
    };

    static isObjectId(value) {
        return ObjectId.isValid(value);
    };

    static isPlainObject(value) {
        if (Object.prototype.toString.call(value) !== `[object Object]`) return false;
        const proto = Object.getPrototypeOf(value);
        return proto === Object.prototype;
    };

    static throwError(status, message) {
        let err = new Error(message);
        err.status = status;
        throw err
    };
};

module.exports = { GeneralUtils };