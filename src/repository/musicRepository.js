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
    selectListMostRecentBelowKey: `
        SELECT  music_id        as musicId
            ,   track_name      as trackName
            ,   album_name      as albumName
            ,   artist_name     as artistName
            ,   music_file_path as musicFilePath
            ,   created_at      as createAt
            ,   updated_at      as updatedAt
        FROM    music
        WHERE   music_id <= ?
        ORDER BY music_id DESC
        LIMIT   5
    `,
    selectMaxKey: `
        SELECT  MAX(music_id) as maxKey
        FROM    music
    `,
    selectPagingKey: `
        SELECT  IFNULL(MAX(music_id), 0) as maxKey
            ,   IFNULL(MIN(music_id), 0) as minKey
        FROM    music 
    `
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
    findListBy: async function({track, musicKey}) {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = `
                ${__musicQueryMapper.findMusicWhereLike} 
                ${db.escape('%'+track.trim()+'%')} 
                AND music_id <= ?         
                ORDER BY music_id DESC 
                LIMIT   5 
            `;
            
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [musicKey],
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
    findListAtPaging: async function({musicKey}) {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = __musicQueryMapper.selectListMostRecentBelowKey;
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [musicKey],
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
    findMostRecentKey: async function() {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            const sql = __musicQueryMapper.selectMaxKey;
            const [rows] = await db.execute({
                                            sql,
                                            values: [],
                                        });
            result = {
                recentKey: rows[0].maxKey
            };
        } catch (error) {
            console.log(error);
        } finally {
            if(db) db.end();     
        }
        return result;        
    },
    findPagingKey: async function(track) {
        let result;
        let db;
        try {
            db = await mysqlConnector.createDb();
            let sql = __musicQueryMapper.selectPagingKey;
            if(track) {
                sql += `
                    WHERE   track_name LIKE ${db.escape('%'+track.trim()+'%')} 
                    ORDER BY music_id DESC 
                `;
            }
            console.log(`execute query : [${sql}]`);
            const [rows] = await db.execute({
                                            sql,
                                            values: [],
                                        });
            result = {
                maxKey: rows[0].maxKey,
                minKey: rows[0].minKey
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