const musicRepository = require('../repository/musicRepository');

const musicService = {
    findMusic: async function({track, id}) {
        if(!track.trim()) {
            return{musicList:[]};
        }
        const musicKey = await this.__determineId(id, track);
        const result = await musicRepository.findListBy({track, musicKey});
        await this.__setPagingKey({
            result, 
            currentKey: musicKey,
            track
        });
        return result;
    },
    addTrack: async function({track, album, artist, filepath}) {
        if(!track || !filepath) {
            return {
                isSuccec: false,
                message: "트랙명 혹은 파일을 필수로 입력하셔야합니다"
            };
        }
        const result = await musicRepository.save({track, album, artist, filepath});
        return result;
    },
    updateTrack: async function({id, track, album, artist, filepath}) {
        const result = await musicRepository.update({id, track, album, artist, filepath});
        return result;
    },
    getPagedMusicList: async function({id}) {
        const musicKey = await this.__determineId(id);
        if(!musicKey) return{musicList:[]};

        const result = await musicRepository.findListAtPaging({musicKey});
        await this.__setPagingKey({
                result, 
                currentKey: musicKey,
            });
        return result;
    },
    __determineId: async function(musicKey, track) {
        if(!musicKey || musicKey === 0) {
            const {maxKey} = await musicRepository.findPagingKey(track);
            return maxKey;
        } else {
            return musicKey; 
        }
    },
    __setPagingKey: async function({result, currentKey, track}) {
        currentKey = Number(currentKey);
        const {maxKey, minKey} = await musicRepository.findPagingKey(track);
        let nextMusicId = currentKey - 5 <= minKey ? minKey : currentKey - 5;
        let previousMusicId = currentKey >= maxKey ? maxKey : currentKey + 5;
        let haveNext = (result.musicList.length < 5 || currentKey - 5 <= minKey) ? false : true;
        let havePrevious = currentKey >= maxKey ? false : true;
        result.paging = {
            nextMusicId,
            previousMusicId,
            haveNext,
            havePrevious
        };
    },

};

module.exports = musicService;