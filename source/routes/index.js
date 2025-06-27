const express = require('express')
const {renderMain, renderProfile} = require('../controllers/index');
const router= express.Router();


router.get('/', renderMain);
router.get('/profile', renderProfile);

module.exports = router;