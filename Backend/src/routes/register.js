const express = require('express');
const router = express.Router();
const controller = require('../controllers/register');

router.post('/',controller.registerEvent);

module.exports = router;