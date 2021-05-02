const express = require('express');
const userService = require('../service/userService');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { id, password, name } = req.body;
    const response = await userService.signup({ id, password, name });
    res.send(response);
});

router.post('/login', async (req, res, next) => {
    const info = await userService.login({req, res, next});
    res.send(info);
});

router.get('/logout', async (req, res) => {
    await userService.logout({ req, res });
    res.send("logout");
});

router.post('/update/password', async (req, res) => {
    const { id, newPassword } = req.body;
    const response = await userService.updateUserPassword({id, newPassword});
    res.send(response);
});

router.get('/info', async (req, res) => {
    const { id } = req.query;
    const response = await userService.getUserInfoBy(id);
    res.send(response);
});

module.exports = router;