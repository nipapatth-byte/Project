const express = require('express');
const router = express.Router();
const controller = require('../controllers/participants');

router.get('/',controller.getAllparticipants);
router.get('/:id',controller.getByIdparticipants);
router.delete('/:id',controller.deleteparticipants);

module.exports = router;