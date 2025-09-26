require('dotenv').config();
const bcrypt = require('bcrypt');
const { GeneralUtils } = require('./generalUtils');
const { UserRepository } = require('../repositories/userRepository');

class UserUtils extends GeneralUtils {
    static repository = new UserRepository();

    static isValidName(name) {
        const re = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]{2,50}$/
        if (typeof name === 'string' && name.trim() !== '') return re.test(name.trim());
        else return false;
    };

    static isValidEmail(email) {
        const re = /^(?!.*\.\.)([a-z0-9]|[a-z0-9][a-z0-9._+-]*[a-z0-9])@([a-z0-9]|[a-z0-9][a-z0-9.-]*[a-z0-9])\.[a-z]{2,}$/i;
        if (typeof email === 'string' && email.trim() !== '') return re.test(email.trim());
        else return false;
    };

    static isValidUsername(username) {
        const re = /^[a-z0-9._]{3,30}$/;
        if (typeof username === 'string' && username.trim() !== '') return re.test(username.trim());
        else return false;
    };

    static isSafePassword(password) {
        const capitalLetters = /[A-Z]/;
        const numbers = /[0-9]/;
        const specialCharacters = /[!@#\$%\^&\*\(\)_\+=\[\]{};':",\.<>/\?-]/;
        const spaces = /\s/;
        if (typeof password !== 'string') return false;
        if (password.length < 8 || !capitalLetters.test(password) || !numbers.test(password) || !specialCharacters.test(password) || spaces.test(password)) return false;
        return true;
    };

    static isValidImageURL(url) {
        const re = /^https?:\/\/[^\s?#]+?\.(png|jpe?g|gif|webp|svg|bmp|ico|tiff)(\?[^#\s]*)?(#\S*)?$/;
        if (typeof url === 'string' && url.trim() !== '') return re.test(url.trim());
        else return false;
    };

    static isTimeString(value) {
        const re = /^(0|[1-9][0-9]*)(m?s|m|h|d|w|y)?$/;
        if (typeof value === 'string' && value.trim() !== '') return re.test(value.trim());
        else return false;
    };

    static isBcryptHash(value) {
        const re = /^\$2[aby]\$(0[4-9]|1\d|2\d|3[01])\$[./A-Za-z0-9]{53}$/;
        if (typeof value === 'string') return re.test(value);
        else return false;
    };

    static async hash(password) {
        let saltRounds = parseInt(process.env.SALT_ROUNDS?.trim());
        if (!Number.isFinite(saltRounds) || saltRounds < 4 || saltRounds > 31) saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    };

    static async verify(plain, hash) {
        return await bcrypt.compare(plain, hash);
    };

    static async hashAll() {
        let checked = 0;
        let updated = 0;
        let skipped = 0;

        console.log('[i] Conectando a la base de datos');

        try {
            const cursor = await this.repository.listPasswords();

            for await (const doc of cursor) {
                checked++;

                if (this.isBcryptHash(doc.password_hash)) { skipped++; continue; };

                const password_hash = await this.hash(doc.password_hash);

                const response = await this.repository.update(doc._id, { password_hash, password_updated_at: new Date() });
                if (response.modifiedCount === 1) updated++;
                else skipped++;
            };

            console.log(`[✓] users — checked=${checked}, updated=${updated}, skipped=${skipped}`);
        } catch (err) {
            console.error('[x] Error:', err?.message ?? 'Unknown');
        };
    };
};

module.exports = { UserUtils };