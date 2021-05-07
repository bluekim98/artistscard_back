const mysql = require('../thirdparty/mysql');
const musicQueryFactory = require('./queryFactory/musicQueryFactory');

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
        const sql = musicQueryFactory.getSqlToInsertMusic();
        const values = [track, album, artist, filepath]
        const {rows} = await mysql.exec({sql, values});
        const result = {
            affectedRows: rows.affectedRows,
            mysqlServerStatus: rows.serverStatus,
            info: rows.info            
        };
        return result;
    },
    update: async function({id, track, album, artist, filepath}) {
        const sql = musicQueryFactory.getSqlToUpdateMusic(['track_name', 'album_name', 'artist_name', 'music_file_path']);
        const values = [track, album, artist, filepath, id];
        const {rows} = await mysql.exec({sql, values});
        const result = {
            affectedRows: rows.affectedRows,
            mysqlServerStatus: rows.serverStatus,
            info: rows.info
        };
        return result;     
    },
    findListBy: async function({track, musicKey}) {
        const escapeTrack = await mysql.escape('%' + track.trim() +'%');
        const sql = musicQueryFactory.getSqlToFindListBy(escapeTrack);
        const values = [musicKey];
        const {rows} = await mysql.exec({sql, values});
        const result = {
            musicList: [
                ...rows
            ]
        };
        return result;
    },
    findListAtPaging: async function({musicKey}) {
        const sql = musicQueryFactory.getSqlToSelectListMostRecentBelowKey();
        const values = [musicKey];
        const {rows} = await mysql.exec({sql, values});
        const result = {
            musicList: [
                ...rows
            ]
        };
        return result;    
    },
    findMostRecentKey: async function() {
        const sql = musicQueryFactory.getSqlToSelectMaxKey();
        const values = [];
        const {rows} = await mysql.exec({sql, values});
        const result = {
            recentKey: rows[0].maxKey
        };
        return result;     
    },
    findPagingKey: async function(track) {
        let sql;
        if(track){
            const escapeTrack = await mysql.escape('%' + track.trim() +'%');
            sql = musicQueryFactory.getSqlToSelectPagingKey(escapeTrack);
        } else {
            sql = musicQueryFactory.getSqlToSelectPagingKey();
        }
        const values = [];
        const {rows} = await mysql.exec({sql, values});
        const result = {
            maxKey: rows[0].maxKey,
            minKey: rows[0].minKey
        };
        return result;    
    },
};

module.exports = musicRepository;