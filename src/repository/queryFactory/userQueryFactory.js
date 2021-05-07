const userQueryFactory = {
    getSqlToInsertUser: (columns = ['user_id', 'user_password', 'password_salt', 'user_name']) => {
        let query = `
            INSERT INTO user ( ${columns.join(', ')} ) 
            VALUES ( ${columns.map(() => ' ? ').join(', ')} )
        `;
        return query;
    },
    getSqlToUpdateUser: (columns) => {
        let query = `
            UPDATE  user
            SET     ${columns.map((column) => ` ${column} = ? `).join(' , ')}
                ,   updated_at = now()
            WHERE   user_id = ? 
        `;
        return query;
    },
    getSqlToFindUser: () => {
        let query = `
            SELECT  user_id as userId,
                    user_password as userPassword,
                    password_salt as passwordSalt,
                    user_name as userName,
                    created_at as createdAt,
                    IFNULL(updated_at, '') as updatedAt
            FROM    user
            WHERE   user_id = ?
                AND deleted_at IS NULL
        `;
        return query;
    },
    getSqlToCountByMatchingUser: () => {
        let query = `
            SELECT  COUNT(*) count
            FROM    user
            WHERE   user_id = ?
                AND user_password = ?
                AND deleted_at IS NULL
        `;
        return query;
    }
};

module.exports = userQueryFactory;