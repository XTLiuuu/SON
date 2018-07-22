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
  console.log('in update_event_post1')
  console.log("test123 = " + req.body.update)
  console.log("test 456 = " + req.body.delete)
  console.log(req.body.update == 'Update')
  console.log(req.body.delete == 'Delete')
  const event_id = req.params.event_id;
  if(req.body.update == 'Update'){
    var sd = req.body.startDate;
    var sd1 = sd.toString();
    var sd2 = sd.slice(0,10);
    var st = req.body.startTime
    var start = sd1 + " " + st + " "
    console.log("start = " + start)
    var ed = req.body.endDate;
    var ed1 = ed.toString();
    if(ed1 == ""){
      ed1 = sd1;
    }
    var ed2 = ed.slice(0,10);
    var et = req.body.endTime
    var end = ed1 + " " + et
    console.log("end = " + end)
    var ad = req.body.allDay
    var allDay;
    if(ad == 'on'){
      allDay = true;
    }
    else{
      allDay = false;
    }
    var curr = Input.findOne({_id: event_id})
    console.log("curr title " + curr.title)
    console.log("curr title " + curr.startTime)
    curr.update({_id: event_id}, {
      email: req.user.googleemail,
      id: req.body.id,
      title: req.body.title,
      allDay: allDay,
      start: start,
      end:end,
      startDate: sd2,
      startTime: req.body.startTime,
      endDate: ed2,
      endTime: req.body.endTime,
      url:req.body.url,
      editable: true,
      overlap: true,
      color: req.body.color,
      description: req.body.description,
      adCheck: req.body.allDay
    }).exec()
    .then( () => {
      res.redirect( '/calendar/calendarD' );
    } )
  }
  else if(req.body.delete == 'Delete'){
    console.log("in delete event")
    Input.deleteOne({_id:event_id})
         .exec()
         .then(()=>{res.redirect('/calendar/calendarD')})
         .catch((error)=>{res.send(error)})
  }

}
