const rateLimit = require('express-rate-limit');

const standardHeaders = true;
const legacyHeaders = false;
const message = 'Rate limit reached (no more requests can be sent)';
const keyGeneratorByUser = (req) => req.user?._id ?? req.ip;
const keyGeneratorByEmail = (req) => (req.body?.email && String(req.body.email).toLowerCase().trim()) ?? req.ip;
const skip = (req) => req.method === 'OPTIONS';

class RateLimiting {
    static registerLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, limit: 3,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByEmail, skip
    });

    static loginLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, limit: 5,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByEmail, skip
    });

    static meLimiter = rateLimit({
        windowMs: 60 * 1000, limit: 60,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser, skip
    });

    static logoutLimiter = rateLimit({
        windowMs: 60 * 1000, limit: 30,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser, skip
    });

    static catalogFilterLimiter = rateLimit({
        windowMs: 60 * 1000, limit: 60,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser, skip
    });

    static catalogfindByCodeLimiter = rateLimit({
        windowMs: 60 * 1000, limit: 180,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser, skip
    });

    static genreListLimiter = rateLimit({
        windowMs: 60 * 1000, limit: 300,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser, skip
    });
};

module.exports = { RateLimiting };