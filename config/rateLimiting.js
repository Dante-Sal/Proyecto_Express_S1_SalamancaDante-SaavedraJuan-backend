const rateLimit = require('express-rate-limit');

const standardHeaders = true;
const legacyHeaders = false;
const message = 'Rate limit reached (no more requests can be sent)';
const keyGeneratorByUser = (req) => req.user?._id ?? req.ip;
const keyGeneratorByEmail = (req) => req.body?.email ?? req.ip;

class RateLimiting {
    static registerLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, max: 3,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser
    });

    static loginLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, max: 5,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByEmail
    });

    static meLimiter = rateLimit({
        windowMs: 60 * 1000, max: 60,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser
    });

    static logoutLimiter = rateLimit({
        windowMs: 60 * 1000, max: 30,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser
    });

    static catalogFilterLimiter = rateLimit({
        windowMs: 60 * 1000, max: 60,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser
    });

    static catalogfindByCodeLimiter = rateLimit({
        windowMs: 60 * 1000, max: 180,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser
    });

    static genreListLimiter = rateLimit({
        windowMs: 60 * 1000, max: 300,
        standardHeaders, legacyHeaders,
        message, keyGenerator: keyGeneratorByUser
    });
};

module.exports = { RateLimiting };