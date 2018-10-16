'use strict';
const Input = require( '../models/Input' );
const Notification = require('../models/Notification');
const Friend = require('../models/Friend');
const Profile = require('../models/Profile');
const mongo = require('mongodb');

exports.get_events_post = function(req, res){
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

// normal get calendar
exports.getCalendar = (req, res) => {
  res.render('calendar');
};

// get calendar for sending events to friend
exports.sendCalendar = (req, res) => {
  const f_id = req.params.friend_id;
  res.render('sendCalendar', {f_id: f_id});
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

exports.show_sending_event = function(req, res){
  const event_id = req.params.event_id;
  const friend_id = req.params.friend_id;
  const friendName = res.locals["friendName"]
    Input.findById(event_id, function(err, doc){
      if(err){
        res.status(err.status || 500);
        res.json(err);
      } else {
        console.log(doc)
        if(doc){
          console.log(friendName)
          res.render('show_sending',{friendName: friendName, event_id: event_id, event_doc: doc, friend_id: friend_id})
        } else {
          res.status(404);
          res.json({status: 404, message: "Not Found."})
        }
      }
    })
  }

  exports.update_event_post = function(req, res){
    const event_id = req.params.event_id;
    if(req.body.update == 'Update'){
      var sd = req.body.startDate;
      var sd1 = sd.toString();
      var sd2 = sd.slice(0,10);
      var st = req.body.startTime
      var start = sd1 + " " + st + " "
      var ed = req.body.endDate;
      var ed1 = ed.toString();
      if(ed1 == ""){
        ed1 = sd1;
      }
      var ed2 = ed.slice(0,10);
      var et = req.body.endTime
      var end = ed1 + " " + et
      var ad = req.body.allDay
      var allDay;
      if(ad == 'on'){
        allDay = true;
      }
      else{
        allDay = false;
      }
      var curr = Input.findOne({_id: event_id})
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
        adCheck: req.body.allDay,
        noti: "false"
      }).exec()
      .then( () => {
        res.redirect( '/calendar/calendarD' );
      } )
    }
    else if(req.body.delete == 'Delete'){
      Input.deleteOne({_id:event_id})
           .exec()
           .then(()=>{res.redirect('/calendar/calendarD')})
           .catch((error)=>{res.send(error)})
    }
  }


exports.send_event = function(req, res){
 const fId = new mongo.ObjectId(req.params.friend_id)
 Profile.findOne(fId)
  .exec()
  .then( (friend) =>{
    var ad = req.body.allday;
    var allDay;
    if(ad == 'on'){
      allDay = true;
    }
    else{
      allDay = false;
    }
    let friendEvent =
     new Notification({
      type:"event invitation",
      to:friend.email,
      toname:friend.name,
      content: "You received an event shared from " + res.locals.profile.name,
      from: res.locals.user.googleemail,
      fromname: res.locals.profile.name,
      title: req.body.title,
      sDate: req.body.startDate,
      sTime: req.body.startTime,
      eDate: req.body.endDate,
      eTime: req.body.endTime,
      allday: allDay,
      description: req.body.description,
    })
    friendEvent.save(function(err, doc){
      if(err){
        res.json(err);
      } else {
        console.log("The event has been sent")
        res.redirect('/friend');
      }
    })

  })
  .catch( ( error ) => {
    console.log( error.message );
    return [];
  } )
  .then( () => {
    console.log( 'setting promise complete' );
  } );
};
