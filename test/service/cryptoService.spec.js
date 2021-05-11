const cryptoService = require("../../src/service/cryptoService");
const assert = require('assert');

describe('cryptoService test!', () => {
    it('is hash & salt working ?', async () => {
        const password = "abc123";
        const {hashPassword, salt} = await cryptoService.passwordEncrypt({plain: password});

        const {hashPassword: anotherPassword, salt: anotherSalt} = await cryptoService.passwordEncrypt({plain: password});
        
        assert.notStrictEqual(password, hashPassword);
        assert.notStrictEqual(hashPassword, anotherPassword);
        const isPasswordMatching = await cryptoService.passwordVerify({givenPw: password, targetPw: hashPassword, targetPwSalt: salt}) 
        assert.strictEqual(isPasswordMatching, true);
    });
});