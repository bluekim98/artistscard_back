module.exports = {
    local: {
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : process.env.DB_LOCAL_PW,
        database : 'artistscard' 
    },
    app: {

    }
};