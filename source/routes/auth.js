const express = require('express');
const User = require('../models/user');
const {isLoggedIn, isNotLoggedIn} = require('../middlewares/index');
const {login, logout, join, changeNick} = require('../controllers/user');
const router = express.Router();

router.post('/join', isNotLoggedIn, join);
router.post('/login', isNotLoggedIn, login);
router.get('/logout', isLoggedIn, logout);
router.post('/profile', changeNick);

module.exports = router;