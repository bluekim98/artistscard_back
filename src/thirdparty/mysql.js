const mysql2 = require('mysql2/promise');
const mysqlConfing = require('../config/db/mysqlConfig');

module.exports = {
    createDb: async function() {
        let connection;
        try {
            const config = process.env.NODE_ENV === 'production' ? mysqlConfing.app : mysqlConfing.local;
            connection = await mysql2.createConnection(config);
        } catch (error) {
            console.log(error);
        }
        return connection;        
    },
    exec: async function({sql, values}) {
        let result;
        let db;
        try {
            db = await this.createDb();
            const [rows] = await db.execute({ sql, values });
            result = {
                rows
            }
        } catch (error) {
            console.log(error);
        } finally {
            if(db) db.end();
        }
        return result;        
    },
};