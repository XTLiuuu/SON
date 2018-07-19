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

exports.update_event_get = function(req, res){
  const event_id = req.params.event_id;
  Input.findById(event_id, function(err, doc){
    if(err){
      res.status(err.status || 500);
      res.json(err);
    } else {
      console.log(doc)
      if(doc){
        res.render('update',{event_doc: doc})
      } else {
        res.status(404);
        res.json({status: 404, message: "Not Found."})
      }
    }
  })
}

exports.update_event_post = function(req, res){
  console.log(req.body);

  res.redirect('/calendar/calendarD');
}

exports.deleteCalendar = function(req, res){

}
