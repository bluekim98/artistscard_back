module.exports = {
    local: {
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : process.env.DB_PASSWORD,
        database : 'artistscard' 
    },
    app: {
        host     : '3.34.45.229',
        port     : '3306',
        user     : 'root',
        password : process.env.DB_PASSWORD,
        database : 'artistscard' 
    }
};