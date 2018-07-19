'use strict';
console.log("in full calendar controller")
const Input = require( '../models/Input' );

exports.get_events_post = function(req, res){
   //events
   Input.find({email:res.locals.user.googleemail})
     .exec()
     .then((event_list) => {
       res.json(event_list);
   })
   .catch((error) => {
     res.status(err.status || 500);
     res.json(err);
   })
   .then(() => {
     console.log('get event post early');
   })
  }


exports.getCalendar = (req, res) => {
  res.render('calendarD');
};
