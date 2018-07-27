'use strict';
const Friend = require( '../models/Friend' );
const Profile = require('../models/Profile');
const Input = require('../models/Input');
const Notification = require('../models/Notification');
const mongo = require('mongodb');
console.log("loading the friend Controller")

exports.searchProfile_post = ( req, res ) => {
  console.log('in searchprofile'+req.body.searchfriend)
  Profile.findOne({email:req.body.searchfriend})
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( friend ) => {
      //console.log("friend"+friend);
      res.render('searchProfile', {friend: friend});
      //next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'profile promise complete' );
    } );
};

exports.searchProfile_get = ( req, res  ) => {
  res.render('searchProfile');
};

exports.sendFrequest = ( req, res ) =>{
  console.log("send friend request");
  //if req.body.searchfriend = null
  let request = new Notification({
                  type: "friend request",
                  to:req.body.friendemail,
                  toname:req.body.friendname,
                  content: "You have a friend request from "+ res.locals.user.googleemail,
                  from: res.locals.user.googleemail,
                  fromname: res.locals.profile.name})
  request.save(function(err, doc){
    if(err){
      res.json(err);
    } else {
      console.log("The invitation has been sent")
      res.redirect( '/friend' );
    }
  })
};

exports.updateRequest = ( req, res )=> {
  if(req.body.accept == 'Accept'){
    console.log("in acceptRequest");
    let newf = new Friend({
      user:res.locals.user.googleemail,
      username: res.locals.profile.name,
      friend:req.body.from,
      friendname:req.body.fromname,
      status:"friend",
    })

    let newf2 = new Friend({
      user:req.body.from,
      username:req.body.fromname,
      friend:res.locals.user.googleemail,
      friendname:res.locals.profile.name,
      status:"friend"
    })

    newf2.save()
    newf.save()

    Notification.deleteOne({
                to: res.locals.user.googleemail,
                from:req.body.from})
                .then( () => {
                  res.redirect('/notification');
                })
                .catch( error => {
                  res.send( error );
                });
  }else if(req.body.cancel == 'Cancel'){
    console.log("in deleteRequest"+req.body.from);
    Notification.deleteOne({to: res.locals.user.googleemail,
                            from:req.body.from})
                .exec()
                .then(()=>{res.redirect('/notification')})
                .catch((error)=>{res.send(error)})
  }
};

exports.getFriend = ( req, res ) => {
  console.log('in getAllNoti')
  console.log('checkStatus=' + res.locals.checkStatus)
  console.log('checkStatus1=' + res.checkStatus)
  Friend.find( {user:res.locals.user.googleemail} )
    .exec()
    .then( ( friend_list ) => {
      res.locals.friend = friend_list
      res.locals.userEmail = res.locals.user.googleemail
      res.locals.userID = res.locals.user._id
      res.render( 'friend');
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'get friend complete' );
    } );
};

exports.getFriend1 = ( req, res ) => {
  console.log('in getAllNoti')
  Friend.find( {user:res.locals.user.googleemail} )
    .exec()
    .then( ( friend ) => {
      res.render( 'friend1', {
        friend: friend
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'get friend complete' );
    } );
};

exports.check_avail = (req, res) =>{
  console.log("in check availability")
  console.dir(req.body)
  console.log(req.body.friendEmail);
  console.log(req.body.checkDate)
  console.log(req.body.checkTime)
  var s = new Date(req.body.checkDate);
  var friendName = req.body.friendName
  var checkDate = req.body.checkDate
  var checkTime = req.body.checkTime
  s.setDate(s.getDate()+1)
  var index = req.body.checkTime.indexOf(":")
  s.setHours(req.body.checkTime.slice(0, index), req.body.checkTime.slice(index + 1, req.body.checkTime.length));
  console.log("s = " + s)
  var start = req.body.checkDate + " " + req.body.checkTime
  console.log(start)
  Input.find({email:req.body.friendEmail},
    function(err, input_list){
      if(err){
        console.log(err.message);
      } else{
        console.log("after getting friend's events")
        console.log("length = " + input_list.length)
        var checkStatus;
        for(var i = 0; i < input_list.length; i ++){
          console.log("list " + i + " startTime = " + input_list[i].startTime)
          console.log("list " + i + " endTime = " + input_list[i].endTime)
          if(input_list[i].endTime != ""){
            if(input_list[i].start <= s && s <= input_list[i].end){
              console.log("input meet is " + input_list[i]);
              checkStatus = "BUSY";
            }
          }
          else{
            if(input_list[i].start == s){
              console.log("input1 meet is " + input_list[i]);
              checkStatus = "BUSY";
            }
          }
        }
        console.log("checkStatus at end is " + checkStatus)
        if(checkStatus != "BUSY"){
          checkStatus = "FREE"
        }
        var answer = {checkStatus: checkStatus, friendName: friendName, checkDate: checkDate, checkTime: checkTime}
        console.dir(answer)
        console.log("checkStatus at end1 is " + checkStatus)
        res.json(answer);
      }
    }
  )
}

exports.attachFriend = (req, res, next) => {
  console.log('in attachFriend')
  console.log("currUser = " + req.body.currUser)
  console.log("currUserID = " + req.body.currUserID)
  console.log(req.body.currUserID)
  Friend.find({user: req.body.currUser},
    function(err, friend_list){
      if(err){
        console.log(err.message);
      } else{
        res.locals.friends = friend_list;
        next();
      }
    }
  ).exec()
}


exports.attachFriend = ( req, res, next ) => {
  console.log('in attachFriend')
  console.log("currUser = " + req.body.currUser)
  console.log("currUserID = " + req.body.currUserID)
  console.log(req.body.currUserID)
  Friend.find({user: req.body.currUser}) //{"_id": objId})
    .exec()
    .then( ( friend_list ) => {
      res.locals.friend_list = friend_list
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'attach Friend promise complete' );
    } );
};


exports.guess_free = (req, res) => {
  console.log('in guess_free')
  console.dir(req.body)
  console.log(res.locals["friend_list"])
  var s = new Date(req.body.checkDate);
  var checkDate = req.body.checkDate
  var checkTime = req.body.checkTime
  s.setDate(s.getDate()+1)
  var index = req.body.checkTime.indexOf(":")
  s.setHours(req.body.checkTime.slice(0, index), req.body.checkTime.slice(index + 1, req.body.checkTime.length));
  console.log("s = " + s)
  var friend_list = res.locals["friend_list"];
  console.log(friend_list.length)
  for(var i = 0; i < friend_list.length; i ++){
    console.log(friend_list[i]["friend"])
    //Input.find({email: friend_list[i]["friend"]})
  }
}