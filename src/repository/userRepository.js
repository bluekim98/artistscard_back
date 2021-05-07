const mysql = require('../thirdparty/mysql');
const userQueryFactory = require('./queryFactory/userQueryFactory');

const userRepository = {
    save: async function(user) {
        const sql = userQueryFactory.getSqlToInsertUser();
        const values = Object.values(user);
        const {rows} = await mysql.exec({sql, values});
        const result = {
            affectedRows: rows.affectedRows,
            mysqlServerStatus: rows.serverStatus,
            info: rows.info
        }
        return result;
    },
    findById: async function(id) {
        const sql = userQueryFactory.getSqlToFindUser();
        const values = [id];
        const {rows} = await mysql.exec({sql, values})
        if(rows.length === 0) return;

        const result = {
            ...rows[0]
        }
        return result;
    },
    updatePassword: async function({targetId, newPassword, newPasswordSalt}) {
        const sql = userQueryFactory.getSqlToUpdateUser(['user_password', 'password_salt']);
        const values = [newPassword, newPasswordSalt, targetId]
        const {rows} = await mysql.exec({sql, values});
        const result = {
            rows
        };
        return result;
    },
    findMatchingUserBy: async function({id, password}) {
        const sql = userQueryFactory.getSqlToCountByMatchingUser();
        const values = [id, password];
        const {rows} = await mysql.exec({sql, values});
        const result = {
            rows: rows[0]
        }
        return result;
    }
};

module.exports = userRepository;