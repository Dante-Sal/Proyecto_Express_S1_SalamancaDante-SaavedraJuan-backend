const { GeneralUtils } = require('./generalUtils');

class CatalogUtils extends GeneralUtils {
    static isValidType(type) {
        const re = /^movie|serie$/i
        if (typeof type === 'string' && type.trim() !== '') return re.test(type.trim());
        else return false;
    };

    static isValidGenre(genre, validGenres) {
        if (Array.isArray(validGenres) && validGenres.length && validGenres.includes(genre.toLowerCase())) return true;
        else return false;
    };

    static isValidOrdering(ordering) {
        const re = /^ranking|popularity$/i
        if (typeof ordering === 'string' && ordering.trim() !== '') return re.test(ordering.trim());
        else return false;
    };

    static escape(search) {
        if (typeof search === 'string' && search.trim() !== '') return search.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');
        else return undefined;
    };
};

module.exports = { CatalogUtils };