const userQueryFactory = require('../../../src/repository/queryFactory/userQueryFactory');
const assert = require('assert');

describe('userQueryFactory test!', () => {
    const defaultInsertQuery = `
        INSERT INTO user ( user_id, user_password, password_salt, user_name ) 
            VALUES (  ? ,  ? ,  ? ,  ?  )
    `;
    it('getInsertUserQuery should return default insert query', () => {
        assert.strictEqual(userQueryFactory.getInsertUserQuery().trim(), defaultInsertQuery.trim());
    });

    it('getUpdateUserQuery you have to check return value in console log', () => {
        console.log(userQueryFactory.getUpdateUserQuery(['user_password', 'password_salt']));
    })
});