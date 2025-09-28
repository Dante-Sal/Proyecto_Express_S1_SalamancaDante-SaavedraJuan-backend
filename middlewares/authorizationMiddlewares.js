const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { UserRepository } = require('../repositories/userRepository');

class Authorization {
    constructor() {
        this.repository = new UserRepository();
        this.cookieExtractor = (req) => req?.signedCookies?.login ?? null;
        this.verifyToken = this.verifyToken.bind(this);
        this.tryToVerifyToken = this.tryToVerifyToken.bind(this);
        this.public = this.public.bind(this);
        this.user = this.user.bind(this);
        this.admin = this.admin.bind(this);
    };

    setStrategy() {
        return new Strategy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([this.cookieExtractor]),
                secretOrKey: process.env.JWT_SECRET ?? '',
                algorithms: ['HS256'],
                ignoreExpiration: false
            },
            async (payload, done) => {
                try {
                    const user = await this.repository.findById(payload._id);
                    if (!user) return done(null, false, { message: 'Access denied (token authentication error)' });
                    return done(null, payload);
                } catch (err) {
                    return done(err, false);
                };
            }
        )
    };

    verifyToken(req, res, next) {
        return passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) return res.status(500).json({ ok: false, error: err.message });
            if (!user) return res.status(401).json({ ok: false, error: info.message });
            req.user = user;
            next();
        })(req, res, next);
    };

    tryToVerifyToken(req, res, next) {
        return passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) return res.status(500).json({ ok: false, error: err.message });
            if (user) req.user = user;
            next();
        })(req, res, next);
    };

    public(req, res, next) {
        if (req.user) return res.status(409).json({ ok: false, error: 'Conflict (user already signed in, it is not possible to access resources specific to anonymity)' });
        next();
    };

    user(req, res, next) {
        if (!req.user) return res.status(401).json({ ok: false, error: 'Access denied (token authentication error)' });
        if (req.user.role !== 'user') return res.status(403).json({ ok: false, message: 'Invalid role (no permissions to access the resource)' });
        next();
    };

    admin(req, res, next) {
        if (!req.user) return res.status(401).json({ ok: false, error: 'Access denied (token authentication error)' });
        if (req.user.role !== 'admin') return res.status(403).json({ ok: false, message: 'Invalid role (no permissions to access the resource)' });
        next()
    };
};

module.exports = { Authorization };