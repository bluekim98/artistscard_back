const mysqlConnector = require('../thirdparty/mysqlConnector');

const __userQueryMapper = {
    inserUser : `
        INSERT INTO user(user_id, user_password, password_salt, user_name)
        VALUES (?, ?, ?, ?)
    `,
    findUser : `
        SELECT  user_id as userId,
                user_password as userPassword,
                password_salt as passwordSalt,
                user_name as userName,
                created_at as createdAt,
                IFNULL(updated_at, '') as updatedAt
        FROM    user
        WHERE   user_id = ?
            AND deleted_at IS NULL
    `,
    findMatchingUser : `
        SELECT  COUNT(*) count
        FROM    user
        WHERE   user_id = ?
            AND user_password = ?
            AND deleted_at IS NULL
    `,
    updatePassword : `
        UPDATE  user
        SET     user_password = ?
            ,   password_salt = ?
            ,   updated_at = now()
        WHERE   user_id = ?
    `,
};

const userRepository = {
    save: async function(user) {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = __userQueryMapper.inserUser;
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [user.id, user.password, user.passwordSalt, user.name],
                                        });
            result = {
                affectedRows: rows.affectedRows,
                mysqlServerStatus: rows.serverStatus,
                info: rows.info
            };
        } catch (error) {
            console.log(error);
        } finally {
            if(db) db.end();     
        }
        return result;
    },
    findById: async function(id) {
        let user;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = __userQueryMapper.findUser;
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [id],
                                });
            const result = {
                ...rows[0]
            };
            if(Object.keys(result).length > 0) {
                user = {
                    ...result
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            if(db) db.end();     
        }
        return user;
    },
    updatePassword: async function({targetId, newPassword, newPasswordSalt}) {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = __userQueryMapper.updatePassword;
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [newPassword, newPasswordSalt, targetId],
                                });
            result = {
                rows
            };
        } catch (error) {
            console.log(error);
        } finally {
            if(db) db.end();     
        }
        return result;
    },
    findMatchingUserBy: async function({id, password}) {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = __userQueryMapper.findMatchingUser;
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [id, password],
                                });
            result = {
                rows: rows[0]
            };
        } catch (error) {
            console.log(error);
        } finally {
            if(db) db.end();     
        }
        return result;
    }
};

module.exports = userRepository;