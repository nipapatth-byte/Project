const express = require('express');
const router = express.Router();
const controller = require('../controllers/participants');
const auth = require('../middlewares/auth');

router.get('/',controller.getAllparticipants);
router.get('/:id',controller.getByIdparticipants);
router.delete('/:id',auth, controller.deleteparticipants);

module.exports = router;