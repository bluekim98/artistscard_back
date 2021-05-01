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
    }
};