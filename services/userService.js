const jwt = require('jsonwebtoken');
const { UserRepository } = require('../repositories/userRepository');
const { UserUtils } = require('../utils/userUtils');
const { UsersStatusRepository } = require('../repositories/usersStatusRepository');

class UserService {
    constructor() {
        this.repository = new UserRepository();
        this.statusRepository = new UsersStatusRepository();
    };

    normalizeRegistrationFields(user) {
        user = UserUtils.trimAll(user);
        user.email = UserUtils.lowercase(user.email);
        user.username = UserUtils.lowercase(user.username);

        return user;
    };

    normalizeRegistrationFields(payload) {
        payload = UserUtils.trimAll(payload);
        payload.email = UserUtils.lowercase(payload.email);

        return payload;
    };

    validateRegistrationRequiredFields(user) {
        const keys = Object.keys(user);

        if (!keys.length) UserUtils.throwError(400, 'Invalid request (insufficient data in the body)');
        if (!keys.includes('first_name')) UserUtils.throwError(400, 'Invalid request (body without \'first_name\' included)');
        if (!keys.includes('first_surname')) UserUtils.throwError(400, 'Invalid request (body without \'first_surname\' included)');
        if (!keys.includes('second_surname')) UserUtils.throwError(400, 'Invalid request (body without \'second_surname\' included)');
        if (!keys.includes('email')) UserUtils.throwError(400, 'Invalid request (body without \'email\' included)');
        if (!keys.includes('username')) UserUtils.throwError(400, 'Invalid request (body without \'username\' included)');
        if (!keys.includes('password')) UserUtils.throwError(400, 'Invalid request (body without \'password\' included)');
    };

    validateLoginRequiredFields(payload) {
        const keys = Object.keys(payload);

        if (!keys.length) UserUtils.throwError(400, 'Invalid request (insufficient data in the body)');
        if (!keys.includes('email')) UserUtils.throwError(400, 'Invalid request (body without \'email\' included)');
        if (!keys.includes('password')) UserUtils.throwError(400, 'Invalid request (body without \'password\' included)');
    };

    validateRegistrationFieldsFormat(user) {
        if (!UserUtils.isValidName(user.first_name ?? '') || (user.second_name && !UserUtils.isValidName(user.second_name))) UserUtils.throwError(400, 'Invalid request (unsupported name format)');
        if (!UserUtils.isValidName(user.first_surname ?? '') || !UserUtils.isValidName(user.second_surname ?? '')) UserUtils.throwError(400, 'Invalid request (unsupported surname format)');
        if (!UserUtils.isValidEmail(user.email ?? '')) UserUtils.throwError(400, 'Invalid request (unsupported \'email\' format)');
        if (!UserUtils.isValidUsername(user.username ?? '')) UserUtils.throwError(400, 'Invalid request (unsupported \'username\' format)');
        if (!UserUtils.isSafePassword(user.password ?? '')) UserUtils.throwError(400, 'Invalid request (unsafe \'password\')');
        if (user.avatar_url && !UserUtils.isValidImageURL(user.avatar_url)) UserUtils.throwError(400, 'Invalid request (unsupported \'avatar_url\' format)');
    };

    validateJWTparameters(secret, expiresIn) {
        if (!secret) UserUtils.throwError(400, 'Invalid request (undefined environment variable \'JWT_SECRET\')');
        expiresIn = UserUtils.isTimeString(expiresIn) ? (/^(?!^0(\.0+)?$)(0|[1-9][0-9]*)(\.[0-9]+)?$/.test(expiresIn.trim()) ? parseFloat(expiresIn) : expiresIn.trim()) : '30m';
        return { secret, expiresIn };
    };

    async validateRegistrationFieldsUniqueness(user) {
        const emailExists = await this.repository.findPublicByEmail(user.email);
        if (emailExists) UserUtils.throwError(409, 'Conflict (\'email\' already registered in the database)');

        const usernameExists = await this.repository.findPublicByUsername(user.username);
        if (usernameExists) UserUtils.throwError(409, 'Conflict (\'username\' already registered in the database)');
    };

    defineAvatar(user) {
        if (user.avatar_url == null || user.avatar_url == '') return user.role === 'admin' ? 'https://i.postimg.cc/XNHhZdnf/admin-purple.png' : 'https://i.postimg.cc/76qczNCV/user-purple.png';
        else return user.avatar_url;
    };

    async searchDefaultStatus(initialStatusName) {
        const statusDoc = await this.statusRepository.findByName(initialStatusName);
        if (!statusDoc) UserUtils.throwError(500, 'Database error (user status \'active\' does not exist)');
        if (!statusDoc.code) UserUtils.throwError(500, 'Database error (user status \'active\' does not have the \'code\' field)');

        return statusDoc.code;
    };

    async validateRegistration(user) {
        if (!UserUtils.isPlainObject(user)) UserUtils.throwError(400, 'Invalid request (bodiless)');
        this.validateRegistrationRequiredFields(user);
        this.validateRegistrationFieldsFormat(user);
        user = this.normalizeRegistrationFields(user);
        await this.validateRegistrationFieldsUniqueness(user);

        return user;
    };

    async verifyCredentials(payload) {
        if (!UserUtils.isPlainObject(payload)) UserUtils.throwError(400, 'Invalid request (bodiless)');
        this.validateLoginRequiredFields(payload);

        const statusCode = await this.searchDefaultStatus('active');
        const credentials = await this.repository.findCredentialsByEmailStatusCode(payload.email, statusCode);
        if (!credentials) UserUtils.throwError(401, 'Access denied (incorrect \'email\' or \'password\')');

        const authorized = await UserUtils.verify(payload.password, credentials.password_hash);
        if (!authorized) UserUtils.throwError(401, 'Access denied (incorrect \'email\' or \'password\')');

        return credentials;
    };

    async register(user) {
        user = await this.validateRegistration(user);

        const names = { first_name: user.first_name };
        const creationDate = new Date();

        if (user.second_name) names.second_name = user.second_name;

        user = {
            ...names,
            first_surname: user.first_surname,
            second_surname: user.second_surname,
            email: user.email,
            username: user.username,
            password_hash: await UserUtils.hash(user.password),
            password_updated_at: creationDate,
            role: user.role,
            avatar_url: this.defineAvatar(user),
            status_code: await this.searchDefaultStatus('active'),
            created_at: creationDate,
            updated_at: creationDate
        };

        const InsertOneResult = await this.repository.create(user);
        const { password_hash, password_updated_at, status_code, updated_at, ...publicUser } = user;

        return { status: 201, data: { _id: InsertOneResult.insertedId, ...publicUser } };
    };

    async signIn(payload) {
        const { _id } = await this.verifyCredentials(payload);
        const { secret, expiresIn } = this.validateJWTparameters(process.env.JWT_SECRET, process.env.JWT_AND_COOKIE_EXPIRES);
        const token = jwt.sign({ _id }, secret, { expiresIn });

        return { status: 200, token }
    };
};

module.exports = { UserService };