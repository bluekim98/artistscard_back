const express = require('express');
const {isLoggedIn, isNotLoggedIn} = require('./middleware/authMiddleware.js');
const userService = require('../service/userService');

const router = express.Router();

router.post('/signup', isNotLoggedIn, async (req, res) => {
    const { id, password, name } = req.body;
    const response = await userService.signup({ id, password, name });
    res.send(response);
});

router.post('/login', isNotLoggedIn, async (req, res, next) => {
    const info = await userService.login({req, res, next});
    res.send(info);
});

router.get('/logout', isLoggedIn, async (req, res) => {
    await userService.logout({ req, res });
    res.send("logout");
});

router.post('/update/password', isLoggedIn, async (req, res) => {
    const { id, password, newPassword } = req.body;
    const response = await userService.updateUserPassword({id, password, newPassword});
    res.send(response);
});

router.get('/info/id', isLoggedIn, async (req, res) => {
    const { id } = req.query;
    let response;
    if (req.user.userId === id) {
        response = await userService.getUserInfoBy(id);
    }
    res.send(response);
});

module.exports = router;