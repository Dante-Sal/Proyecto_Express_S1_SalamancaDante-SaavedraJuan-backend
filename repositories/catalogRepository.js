const { MongoDBConnection } = require('../config/db');

class CatalogRepository {
    constructor() {
        this.connection = new MongoDBConnection();
    };

    async filter(type, genre, ordering, search) {
        const collection = await this.connection.connect('catalog');

        const pipeline = [
            { $lookup: { from: 'catalog_status', localField: 'status_code', foreignField: 'code', as: 'status' } },
            { $unwind: '$status' },
            { $lookup: { from: 'titles_genres', localField: 'code', foreignField: 'title_code', as: 'genre_bridge' } },
            { $lookup: { from: 'genres', localField: 'genre_bridge.genre_code', foreignField: 'code', as: 'genres' } },
            {
                $project: {
                    _id: 0, code: 1, poster_url: { $ifNull: ['$poster_url', '$$REMOVE'] },
                    backdrop_url: { $ifNull: ['$backdrop_url', '$$REMOVE'] }, genres: '$genres.name',
                    original_language: 1, adult: { $cond: [{ $eq: ['$adult', true] }, '18+', '18-'] },
                    status: '$status.status', avg_score: 1, ranking: 1, popularity: 1, type: 1, title: 1,
                    release_date: { $cond: [{ $eq: ['$type', 'movie'] }, '$release_date', '$$REMOVE'] },
                    first_air_date: { $cond: [{ $eq: ['$type', 'serie'] }, '$first_air_date', '$$REMOVE'] },
                    runtime: { $cond: [{ $eq: ['$type', 'movie'] }, '$runtime', '$$REMOVE'] },
                    episode_runtime_avg: { $cond: [{ $eq: ['$type', 'serie'] }, '$episode_runtime_avg', '$$REMOVE'] },
                    number_of_seasons: { $cond: [{ $eq: ['$type', 'serie'] }, '$number_of_seasons', '$$REMOVE'] },
                    number_of_episodes: { $cond: [{ $eq: ['$type', 'serie'] }, '$number_of_episodes', '$$REMOVE'] }
                }
            },
            { $match: { status: 'approved' } }
        ];

        if (type === 'movie' || type === 'serie') pipeline.splice(0, 0, { $match: { type } });
        if (genre != undefined) pipeline.push({ $match: { genres: genre } });
        if (ordering === 'ranking') pipeline.push({ $sort: { ranking: -1 } });
        else pipeline.push({ $sort: { popularity: -1 } });
        if (search != undefined) pipeline.splice(1, 0, { $match: { title: { $regex: search, $options: 'i' } } });

        return await collection.aggregate(pipeline, { collation: { locale: 'en', strength: 1 } }).toArray();
    };

    async findByCode(code) {
        const collection = await this.connection.connect('catalog');
        const title = await collection.aggregate([
            { $match: { code } },
            { $lookup: { from: 'titles_genres', localField: 'code', foreignField: 'title_code', as: 'genre_bridge' } },
            { $lookup: { from: 'genres', localField: 'genre_bridge.genre_code', foreignField: 'code', as: 'genres' } },
            {
                $project: {
                    _id: 0, code: 1, overview: 1, poster_url: { $ifNull: ['$poster_url', '$$REMOVE'] },
                    backdrop_url: { $ifNull: ['$backdrop_url', '$$REMOVE'] }, genres: '$genres.name',
                    original_language: 1, adult: { $cond: [{ $eq: ['$adult', true] }, '18+', '18-'] },
                    avg_score: 1, score_count: 1, title: 1,
                    release_date: { $cond: [{ $eq: ['$type', 'movie'] }, '$release_date', '$$REMOVE'] },
                    first_air_date: { $cond: [{ $eq: ['$type', 'serie'] }, '$first_air_date', '$$REMOVE'] },
                    runtime: { $cond: [{ $eq: ['$type', 'movie'] }, '$runtime', '$$REMOVE'] },
                    episode_runtime_avg: { $cond: [{ $eq: ['$type', 'serie'] }, '$episode_runtime_avg', '$$REMOVE'] },
                    number_of_seasons: { $cond: [{ $eq: ['$type', 'serie'] }, '$number_of_seasons', '$$REMOVE'] },
                    number_of_episodes: { $cond: [{ $eq: ['$type', 'serie'] }, '$number_of_episodes', '$$REMOVE'] }
                }
            }
        ]).toArray();

        return title[0] ?? {};
    };
};

module.exports = { CatalogRepository };