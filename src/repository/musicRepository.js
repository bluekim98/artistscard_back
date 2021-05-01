const mysqlConnector = require('../thirdparty/mysqlConnector');

const __musicQueryMapper = {
    insertMusic: `
        INSERT INTO music(track_name, album_name, artist_name, music_file_path)
        VALUES (?, ?, ?, ?)
    `,
    updateMusic: `
        UPDATE  music
        SET     track_name = ?
            ,   album_name = ?
            ,   artist_name = ?
            ,   music_file_path = ?
            ,   updated_at = now()
        WHERE   music_id = ?
    `,
    findMusicWhereLike: `
        SELECT  music_id        as musicId
            ,   track_name      as trackName
            ,   album_name      as albumName
            ,   artist_name     as artistName
            ,   music_file_path as musicFilePath
            ,   created_at      as createAt
            ,   updated_at      as updatedAt
        FROM    music
        WHERE   track_name LIKE 
    `,
};

const musicRepository = {

    save: async function({track, album, artist, filepath}) {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = __musicQueryMapper.insertMusic;
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [track, album, artist, filepath],
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
    update: async function({id, track, album, artist, filepath}) {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = __musicQueryMapper.updateMusic;
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [track, album, artist, filepath, id],
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
    findBy: async function({track}) {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = __musicQueryMapper.findMusicWhereLike+db.escape('%'+track.trim()+'%');
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [track],
                                        });
            result = {
                musicList: [
                    ...rows
                ]
            };
        } catch (error) {
            console.log(error);
        } finally {
            if(db) db.end();     
        }
        return result;        
    },
};

module.exports = musicRepository;