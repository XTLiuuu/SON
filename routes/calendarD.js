var express = require('express');
var router = express.Router();

var fullcalenController = require('../controllers/fullcalenController');

/* GET home page. */
router.get('/calendarD', fullcalenController.getCalendar);
//   /calendar/calendarD

router.post('/get_events', fullcalenController.get_events_post);
//  /calendar/get_events

module.exports = router;
