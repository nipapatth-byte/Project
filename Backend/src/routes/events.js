const express = require('express');
const router = express.Router();
const controller = require('../controllers/events');
const auth = require('../middlewares/auth');

router.get('/',controller.getAllEvents);
router.get('/:id',controller.getByIdEvents);
router.post('/',auth, controller.createEvent);
router.put('/:id',auth, controller.updateEvent);
router.delete('/:id',auth, controller.deleteEvent);

module.exports = router;