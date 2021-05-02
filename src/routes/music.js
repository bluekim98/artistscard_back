const musicService = require('../service/musicService');
const s3upload = require('./middleware/s3upload');

const express = require('express');
const router = express.Router();


router.get('/track', async (req, res) => {
    const {track, id} = req.query;
    const result = await musicService.findMusic({track, id});
    res.send(result);
});

router.post('/file', s3upload.single('music'), async (req, res) => {
    const response = {
        filepath: req.file.location
    };
    res.send(response);
});

router.post('/track', async (req, res) => {
    const {track, album, artist, filepath} = req.body;
    const result = await musicService.addTrack({track, album, artist, filepath});
    res.send(result);
});

router.put('/track/id', async (req, res) => {
    const {id, track, album, artist, filepath} = req.body;
    const result = await musicService.updateTrack({id, track, album, artist, filepath});
    res.send(result);
});

router.get('/list', async (req, res) => {
    const {id, track} = req.query;
    let result;
    if(track) {
        result = await musicService.findMusic({track, id});
    } else {
        result = await musicService.getPagedMusicList({id});
    }
    res.send(result);
});

module.exports = router;