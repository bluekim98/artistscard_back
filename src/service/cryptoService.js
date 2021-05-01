const crypto = require('crypto');

const cryptoService = {
    passwordEncrypt: async function ({plain}) {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(64).toString('base64');

            crypto.pbkdf2(plain, salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) throw err;
                const result = derivedKey.toString('base64');
                return resolve({ hashPassword: result, salt });
            });
        });
    },
    passwordVerify: async function ({givenPw, targetPw, targetPwSalt}) {
        return new Promise((resolve, reject) => {
            let result = '';
            crypto.pbkdf2(givenPw, targetPwSalt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) return reject(err);
                result = derivedKey.toString('base64');
                return resolve(result === targetPw);
            });
        });
    }
};

module.exports = cryptoService;