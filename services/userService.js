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

    validateRegistrationRequiredFields(user) {
        let status = 400;
        const keys = Object.keys(user);

        if (!keys.length) UserUtils.throwError(status, 'Invalid request (insufficient data in the body)');
        if (!keys.includes('first_name')) UserUtils.throwError(status, 'Invalid request (body without \'first_name\' included)');
        if (!keys.includes('first_surname')) UserUtils.throwError(status, 'Invalid request (body without \'first_surname\' included)');
        if (!keys.includes('second_surname')) UserUtils.throwError(status, 'Invalid request (body without \'second_surname\' included)');
        if (!keys.includes('email')) UserUtils.throwError(status, 'Invalid request (body without \'email\' included)');
        if (!keys.includes('username')) UserUtils.throwError(status, 'Invalid request (body without \'username\' included)');
        if (!keys.includes('password')) UserUtils.throwError(status, 'Invalid request (body without \'password\' included)');
    };

    validateRegistrationFieldsFormat(user) {
        let status = 400;

        if (!UserUtils.isValidName(user.first_name ?? '') || (user.second_name && !UserUtils.isValidName(user.second_name))) UserUtils.throwError(status, 'Invalid request (unsupported name format)');
        if (!UserUtils.isValidName(user.first_surname ?? '') || !UserUtils.isValidName(user.second_surname ?? '')) UserUtils.throwError(status, 'Invalid request (unsupported surname format)');
        if (!UserUtils.isValidEmail(user.email ?? '')) UserUtils.throwError(status, 'Invalid request (unsupported \'email\' format)');
        if (!UserUtils.isValidUsername(user.username ?? '')) UserUtils.throwError(status, 'Invalid request (unsupported \'username\' format)');
        if (!UserUtils.isSafePassword(user.password ?? '')) UserUtils.throwError(status, 'Invalid request (unsafe \'password\')');
        if (user.avatar_url && !UserUtils.isValidImageURL(user.avatar_url)) UserUtils.throwError(status, 'Invalid request (unsupported \'avatar_url\' format)');
    };

    async validateRegistrationFieldsUniqueness(user) {
        let status = 409;

        const emailExists = await this.repository.findPublicByEmail(user.email);
        if (emailExists) UserUtils.throwError(status, 'Conflict (\'email\' already registered in the database)');

        const usernameExists = await this.repository.findPublicByUsername(user.username);
        if (usernameExists) UserUtils.throwError(status, 'Conflict (\'username\' already registered in the database)');
    };

    defineAvatar(user) {
        if (user.avatar_url == null || user.avatar_url == '') return user.role === 'admin' ? 'https://i.postimg.cc/XNHhZdnf/admin-purple.png' : 'https://i.postimg.cc/76qczNCV/user-purple.png';
        else return user.avatar_url;
    };

    async searchInitialStatus(initialStatusName) {
        let status = 500;

        const statusDoc = await this.statusRepository.findByName(initialStatusName);
        if (!statusDoc) UserUtils.throwError(status, 'Database error (user status \'active\' does not exist)');
        if (!statusDoc.code) UserUtils.throwError(status, 'Database error (user status \'active\' does not have the \'code\' field)');

        return statusDoc.code;
    };

    async validateRegistration(user) {
        let status = 400;

        if (!UserUtils.isPlainObject(user)) UserUtils.throwError(status, 'Invalid request (bodiless)');
        this.validateRegistrationRequiredFields(user);
        this.validateRegistrationFieldsFormat(user);
        user = this.normalizeRegistrationFields(user);
        await this.validateRegistrationFieldsUniqueness(user);

        return user;
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
            status_code: await this.searchInitialStatus('active'),
            created_at: creationDate,
            updated_at: creationDate
        };

        const InsertOneResult = await this.repository.create(user);
        const { password_hash, password_updated_at, status_code, updated_at, ...publicUser } = user;

        return { status: 201, data: { _id: InsertOneResult.insertedId, ...publicUser } };
    };
};

module.exports = { UserService };