const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', eventController.getEvents);
router.post('/', roleMiddleware('organizer'), eventController.createEvent);
router.put('/:id', roleMiddleware('organizer'), eventController.updateEvent);
router.delete('/:id', roleMiddleware('organizer'), eventController.deleteEvent);
router.post('/:id/register', eventController.registerForEvent);

module.exports = router;