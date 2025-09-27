const { CatalogRepository } = require('../repositories/catalogRepository');
const { CatalogUtils } = require('../utils/catalogUtils');
const { GenreRepository } = require('../repositories/genreRepository');

class CatalogService {
    constructor() {
        this.repository = new CatalogRepository();
        this.genreRepository = new GenreRepository();
    };

    normalizeFilteringFields(query) {
        query = CatalogUtils.trimAll(query);
        query.search = CatalogUtils.escape(query.search);

        return query;
    };

    validateFilteringRequiredFields(query) {
        const keys = Object.keys(query);

        if (!keys.length) CatalogUtils.throwError(400, 'Invalid request (insufficient data in the query)');
        if (!keys.includes('type')) CatalogUtils.throwError(400, 'Invalid request (query without \'type\' included)');
        if (!keys.includes('ordering')) CatalogUtils.throwError(400, 'Invalid request (query without \'ordering\' included)');
    };

    validateSearchByCodeRequiredFields(params) {
        const keys = Object.keys(params);

        if (!keys.length) CatalogUtils.throwError(400, 'Invalid request (insufficient data in the parameters)');
        if (!keys.includes('code')) CatalogUtils.throwError(400, 'Invalid request (no \'code\' parameters included)');
    };

    async validateFilteringFieldsFormat(query) {
        const genresData = await this.genreRepository.list();
        const validGenres = [];

        genresData.forEach(genreDoc => { if (genreDoc.name) validGenres.push(genreDoc.name.toLowerCase()); });

        if (!CatalogUtils.isValidType(query.type ?? '')) CatalogUtils.throwError(400, 'Invalid request (unsupported \'type\')');
        if (query.genre && !CatalogUtils.isValidGenre(query.genre, validGenres)) CatalogUtils.throwError(400, 'Invalid request (unsupported \'genre\')');
        if (!CatalogUtils.isValidOrdering(query.ordering ?? '')) CatalogUtils.throwError(400, 'Invalid request (unsupported \'ordering\')');
    };

    async validateFiltering(query) {
        if (!CatalogUtils.isPlainObject(query)) CatalogUtils.throwError(400, 'Invalid request (queryless)');
        this.validateFilteringRequiredFields(query);
        await this.validateFilteringFieldsFormat(query);
        query = this.normalizeFilteringFields(query);

        return query;
    };

    validateSearchByCode(params) {
        this.validateSearchByCodeRequiredFields(params);
        if (!CatalogUtils.isValidCode(params.code ?? '')) CatalogUtils.throwError(400, 'Invalid request (unsupported \'code\' format)');
        params.code = parseInt(params.code.trim());

        return params;
    };

    async filter(query) {
        query = await this.validateFiltering(query);
        const { type, genre, ordering, search } = query;
        return await this.repository.filter(type, genre, ordering, search);
    };

    async findByCode(params) {
        params = this.validateSearchByCode(params);
        return await this.repository.findByCode(params.code);
    };
};

module.exports = { CatalogService };