const mysql = require('../thirdparty/mysql');
const musicQueryFactory = require('./queryFactory/musicQueryFactory');

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
        const sql = musicQueryFactory.getSqlToFindListBy(`'%${track.trim()}%'`);
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
            sql = musicQueryFactory.getSqlToSelectPagingKey(`'%${track.trim()}%'`);
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