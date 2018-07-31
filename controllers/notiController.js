'use strict';
const Noti = require( '../models/Notification' );
const mongo = require('mongodb');
const Input = require('../models/Input');
const User = require('../models/user')
console.log("loading the notification Controller")

// this displays all of the skills
exports.getAllNotis = ( req, res ) => {
  console.log('in getAllNoti')
  Noti.find( {to:res.locals.user.googleemail})
    .exec()
    .then( ( notis ) => {
      res.render( 'notification', {
        notis: notis
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'get all notifications complete' );
    } );
};

exports.getNoti = ( req, res ) => {
  const objId = new mongo.ObjectId(req.params.id)
  console.log('in get notification')
  Noti.findOne(objId)
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( noti) => {
      noti: noti
      res.render('notification');
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'notification promise complete' );
    } );
};


exports.attachNoti = ( req, res, next ) => {
  console.log('in attachNoti')
  //const objId = new mongo.ObjectId(req.params.id)
  Input.find({}) //{"_id": objId})
    .exec()
    .then( ( noti ) => {
      res.locals.noti = noti
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log("profile1=" + res.locals.profile);
      console.log( 'attach notification promise complete' );
    } );
};

exports.countNoti = (req, res) => {
  console.log("in count noti 1")
  console.log("here")
  console.log(req.user.googleemail)
  Noti.find({
    to: req.user.googleemail
  }).exec().then((noti_list)=> {
    console.log(noti_list)
    console.log("count notification here")
    console.log("noti number" + noti_list.length)
    res.json(noti_list.length);
  }).catch((err) => {
    console.log("in count notification err")
    res.status(err.status || 500);
    res.json(err);
  })
}

exports.generateNoti = (req, res) => {
  const current_date = new Date();
  const current_date_start = new Date(current_date.toISOString().substring(0, current_date.toISOString().indexOf("T")));
  console.dir(current_date_start)
  Input.find({
    start: {$gte: current_date_start},
    email: req.user.googleemail,
    noti: "false"
  }).exec().then((input_list1)=> {
    console.log("in test_json again3")
    console.log(input_list1)
    for(var i = 0; i < input_list1.length; i ++){
      const d = new Date(input_list1[i].start)
      const n = new Date()
      const dn = (d-n)
      const title = input_list1[i].title
      if ((dn<1000*60*5) && (dn>0)) {
        console.log("in storing notification")
        input_list1[i].noti = "true"
        var content1;
        if(input_list1[i].allDay){
          content1 = "You have an all day event on " + input_list1[i].startDate
        }
         else if(input_list1[i].endTime){
           if(input_list1[i].endDate == input_list1[i].startDate){
             content1 = "You have an event from " + input_list1[i].startTime + " to " + input_list1[i].endTime
           }
           else{
             content1 = "You have an event from " +  input_list1[i].startDate + " at " + input_list1[i].startTime + " to " + input_list1[i].endDate + " at " + input_list1[i].endTime
           }
        }
        else{
          content1 = "You have an event at " + input_list1[i].startTime
        }
        console.log("content1 = " + content1)
        console.log(req.user.googleemail)
        let notification = new Noti({
          type: "event reminder",
          content: content1,
          to: req.user.googleemail,
          title: input_list1[i].title,
          sTime: input_list1[i].startTime,
          sDate: input_list1[i].startDate,
          eTime: input_list1[i].endTime,
          eDate: input_list1[i].endDate,
          allday: input_list1[i].allDay,
          description: input_list1[i].description,
         })
        console.log(notification)
        notification.save();
        input_list1[i].save()
      }
    }
    res.json(input_list1);
  }).catch((err) => {
    console.log("in test_json err")
    res.status(err.status || 500);
    res.json(err);
  })
}
