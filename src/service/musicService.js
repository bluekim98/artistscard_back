const musicRepository = require('../repository/musicRepository');

const musicService = {
    findMusic: async function({track}) {
        if(!track.trim()) {
            return{musicList:[]};
        }
        const result = await musicRepository.findBy({track});
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
    }
};

module.exports = musicService;