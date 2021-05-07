const musicQueryFactory = {
    getSqlToInsertMusic: (columns = ['track_name', 'album_name', 'artist_name', 'music_file_path']) => {
        let query = `
            INSERT INTO music ( ${columns.join(', ')} ) 
            VALUES ( ${columns.map(() => ' ? ').join(', ')} )
        `;
        return query;
    },
    getSqlToUpdateMusic: (columns) => {
        let query = `
            UPDATE  music
            SET     ${columns.map((column) => ` ${column} = ? `).join(' , ')}
                 ,   updated_at = now()
            WHERE   music_id = ?
        `;
        return query;
    },
    getSqlToFindListBy: (track) => {
        let query = `
            SELECT  music_id        as musicId
                ,   track_name      as trackName
                ,   album_name      as albumName
                ,   artist_name     as artistName
                ,   music_file_path as musicFilePath
                ,   created_at      as createAt
                ,   updated_at      as updatedAt
            FROM    music
            WHERE   track_name LIKE ${track} 
                AND music_id <= ?         
            ORDER BY music_id DESC 
            LIMIT   5 
        `;
        return query;
    },
    getSqlToSelectListMostRecentBelowKey: () => {
        let query = `
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
        `;
        return query;
    },
    getSqlToSelectMaxKey: () => {
        let query = `
            SELECT  MAX(music_id) as maxKey
            FROM    music        
        `;
        return query;
    },
    getSqlToSelectPagingKey: (track) => {
        let query = `
            SELECT  IFNULL(MAX(music_id), 0) as maxKey
                ,   IFNULL(MIN(music_id), 0) as minKey
            FROM    music         
        `;
        if(track) {
            query += `
                WHERE   track_name LIKE ${track} 
                ORDER BY music_id DESC 
            `;
        }
        return query;
    }
};

module.exports = musicQueryFactory;