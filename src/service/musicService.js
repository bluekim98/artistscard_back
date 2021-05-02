const musicRepository = require('../repository/musicRepository');

const musicService = {
    findMusic: async function({track, id}) {
        if(!track.trim()) {
            return{musicList:[]};
        }
        const musicKey = await this.__determineId(id);
        const result = await musicRepository.findListBy({track, musicKey});
        this.__setPagingKey(result);
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
        this.__setPagingKey(result);
        return result;
    },
    __determineId: async function(musicKey) {
        if(musicKey) return musicKey;
        const result = await musicRepository.findMostRecentKey();
        return result.recentKey;
    },
    __setPagingKey: function(result) {
        const findedList = result.musicList;
        result.nextMusicId = findedList.length === 0 ? 0 : findedList[findedList.length-1].musicId - 1;
        result.previousMusicId = findedList.length === 0 ? 0 : findedList[0].musicId + 5;
    }
};

module.exports = musicService;