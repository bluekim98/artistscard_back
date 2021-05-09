const mysql2 = require('mysql2/promise');
const mysqlConfing = require('../config/db/mysqlConfig');

module.exports = {
    createDb: async function() {
        let connection;
        try {
            connection = await mysql2.createConnection(mysqlConfing.local);
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