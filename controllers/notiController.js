'use strict';
const mongo = require('mongodb');
const Input = require('../models/Input')
const User = require('../models/user')
const Friend = require('../models/Friend')
const Notification = require( '../models/Notification' )
const Profile = require( '../models/Profile' )

// this displays all of the skills
exports.getAllNotis = ( req, res ) => {
  Notification.find({to:res.locals.user.googleemail})
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

exports.interact_history = (req, res) =>{
   const fId = new mongo.ObjectId(req.params.friend_id)
   res.render('history');
}

exports.getNoti = ( req, res ) => {
  const objId = new mongo.ObjectId(req.params.id)
  console.log('in get notification')
  Notification.findOne(objId)
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

exports.countNoti = (req, res) => {
  Notification.find({
    to: req.user.googleemail,
    type: {$in: ["event reminder","friend request"]}
  }).exec().then((noti_list)=> {
    res.json(noti_list.length);
  }).catch((err) => {
    res.status(err.status || 500);
    res.json(err);
  })
}

exports.countMessage = (req, res) =>{
  Notification.find({
    to: req.user.googleemail,
    type: {$in: ["event invitation"]},
    status:{$in: "Waiting"}
  }).exec().then((noti_list)=> {
    res.json(noti_list.length);
  }).catch((err) => {
    res.status(err.status || 500);
    res.json(err);
  })
}

exports.generateNoti = (req, res) => {
  const current_date = new Date();
  const current_date_start = new Date(current_date.toISOString().substring(0, current_date.toISOString().indexOf("T")));
  Input.find({
    start: {$gte: current_date_start},
    email: req.user.googleemail,
    noti: "false"
  }).exec().then((input_list1)=> {
    for(var i = 0; i < input_list1.length; i ++){
      const d = new Date(input_list1[i].start)
      const n = new Date()
      const dn = (d-n)
      const title = input_list1[i].title
      if ((dn<1000*60*5) && (dn>0)) {
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
        let notification = new Notification({
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

exports.updateRequest = ( req, res )=> {
  // the user accept the friend request
  if(req.body.accept == 'Accept'){
    addFriend(req, res)
  }
  // if the user decline the friend's request
  else if(req.body.cancel == 'Cancel'){
    declineFriend(req, res)
  }
  else if(req.body.add == 'Add'){
    addEvent(req, res)
  }
  else if(req.body.decline == 'Decline'){
    declineEvent(req, res)
  }
  else if(req.body.ok == 'OK'){
    Notification.deleteOne({_id: req.body.id})
    .exec()
    .then(()=>{res.redirect('/notification')})
    .catch((error)=>{res.send(error)})
  }
};

function addFriend(req, res){
  // add friend object to both side
  var name = req.body.fromname
  var firstname = name.substring(0, name.indexOf(" "))
  var lastname = name.substring(name.indexOf(" ") + 1)
  var friendProfile = getProfile(req.body.from)
  Profile.update({email:res.locals.user.googleemail},
    {
      $push: {
        friend: {
          friendEmail: req.body.from, group: "default"
        },
        friendGroup: {
          name: "default", member: req.body.from
        }
      }
    }).exec()

  Profile.update({email:req.body.from},
    {
      $push: {
        friend: {
          friendEmail: res.locals.user.googleemail, group: "default"
        },
        friendGroup: {
          name: "default", member: res.locals.user.googleemail
        }
      }
    }).exec()

  let friend1 = new Friend({
    user:res.locals.user.googleemail,
    username: res.locals.profile.name,
    friend:req.body.from,
    friendname:req.body.fromname,
    firstname: firstname,
    lastname: lastname,
    status:"friend",
    group: "default"
  })
  let friend2 = new Friend({
    user:req.body.from,
    username:req.body.fromname,
    friend:res.locals.user.googleemail,
    friendname:res.locals.profile.name,
    firstname: res.locals.profile.firstname,
    lastname: res.locals.profile.lastname,
    status:"friend",
    group: "default"
  })
  friend1.save()
  friend2.save()
  // delete notification
  Notification.deleteMany({
    type:"friend request",
    to: res.locals.user.googleemail,
    from:req.body.from
  }).then( () => {
      res.redirect('/notification');
  })
  .catch( error => {
    res.send( error );
  });
}

function getProfile(friendEmail){
  Profile.find({email: friendEmail},
  function(err, friendProfile){
    if(err){
      console.log(err.message)
    }
    else{
      return friendProfile
    }
  })
}

function declineFriend(req, res){
  Notification.deleteMany(
    {type:"friend request",
      to: res.locals.user.googleemail,
      from:req.body.from
  }).exec()
  .then(()=>{res.redirect('/notification')})
  .catch((error)=>{res.send(error)})
}

function addEvent(req, res){
  var sd = req.body.startDate;
  var start = sd.toString() + " " + req.body.startTime
  var ed = req.body.endDate;
  if(ed == "") ed = sd
  var end = ed.toString() + " " + req.body.endTime
  var allDay = false;
  if(req.body.allDay == 'on') allDay = true

  let newInput = new Input( {
    email: req.user.googleemail,
    title: req.body.title,
    allDay: allDay,
    start: start, // include both date and time
    end:end,
    startDate: sd.slice(0,10),
    startTime: req.body.startTime,
    endDate: ed.slice(0,10),
    endTime: req.body.endTime,
    editable: true,
    overlap: true,
    color: req.body.color,
    description: req.body.description,
    adCheck: req.body.allDay,
    noti: "false"
  } )
  newInput.save();
  Notification.deleteOne({
    type:"event invitation",
    to: res.locals.user.googleemail,
    from:req.body.from})
    .then( () => {
      res.redirect('/notification');
    })
    .catch( error => {
      res.send( error );
  });
}

function declineEvent(req, res){
  Notification.deleteOne
    ({type:"event invitation",
      to: res.locals.user.googleemail,
      from:req.body.from})
    .exec()
    .then(()=>{res.redirect('/notification')})
    .catch((error)=>{res.send(error)})
}
