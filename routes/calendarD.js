var express = require('express');
var router = express.Router();

var fullcalenController = require('../controllers/fullcalenController');
var isLoggedIn = function (req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      return next();
    }
    console.log("user has not been authenticated...")
    // if they aren't redirect them to the home page
    res.redirect('/auth/google');
}

/* GET home page. */
router.get('/calendarD', isLoggedIn, fullcalenController.getCalendar);
//   /calendar/calendarD

router.post('/get_events', isLoggedIn, fullcalenController.get_events_post);
//  /calendar/get_events

module.exports = router;
