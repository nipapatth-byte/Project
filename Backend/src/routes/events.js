const express = require('express');
const router = express.Router();
const controller = require('../controllers/events');

router.get('/',controller.getAllEvents);
router.get('/:id',controller.getByIdEvents);
router.post('/',controller.createEvent);
router.put('/:id',controller.updateEvent);
router.delete('/:id',controller.deleteEvent);

module.exports = router;