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
    .then( ( friend ) => {
      res.render('searchProfile', {friend: friend});
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
  console.log("send friend request1");
  console.log(req.body.friendemail)
  console.log(res.locals.profile.email)
  if(req.body.friendemail == res.locals.profile.email){
    console.log("same")
    res.json("same");
    return;
  }
  Friend.find({
    user: res.locals.profile.email,
    friend: req.body.friendemail,
  },function(err, result){
    console.log("after finding")
    console.log(result)
    if(err){
      console.log("err")
      res.status(err.status || 500)
      console.log(err.message);
      return;
    } else{
      if(result.length != 0){
        res.json("exist")
        return;
      }
      else{
        let request =
          new Notification({
            type: "friend request",
            to:req.body.friendemail,
            toname:req.body.friendname,
            content: "You have a friend request from "+ res.locals.user.googleemail,
            from: res.locals.user.googleemail,
            fromname: res.locals.profile.name
          })
        request.save();
        res.json("done")
        return;
      };
      }
    })
  }


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

    Notification.deleteMany({
      type:"friend request",
      to: res.locals.user.googleemail,
      from:req.body.from})
      .then( () => {
        res.redirect('/notification');
      })
      .catch( error => {
        res.send( error );
      });
  } else if(req.body.cancel == 'Cancel'){
    console.log("in deleteRequest"+req.body.from);
    Notification.deleteMany(
      {type:"friend request",
        to: res.locals.user.googleemail,
        from:req.body.from})
    .exec()
    .then(()=>{res.redirect('/notification')})
    .catch((error)=>{res.send(error)})
  }
  else if(req.body.add == 'Add'){
    console.log("in acceptaInvitation");
    var sd = req.body.startDate;
    var sd1 = sd.toString();
    var st = req.body.startTime;
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
    let newi = new Input({
      email: res.locals.user.googleemail,
      title:req.body.title.trim() + " from " + req.body.fromname,
      startDate: req.body.startDate,
      startTime: req.body.startTime,
      start: start,
      end: end,
      endDate: req.body.endDate,
      endTime:req.body.endTime,
      description: req.body.description,
      noti: "false"
    });
    newi.save();
    console.log(newi)
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
  else if(req.body.decline == 'Decline'){
    console.log("in deleteInvitation"+req.body.from);
    Notification.deleteOne
    ({type:"event invitation",
      to: res.locals.user.googleemail,
      from:req.body.from})
    .exec()
    .then(()=>{res.redirect('/notification')})
    .catch((error)=>{res.send(error)})
  }
  else if(req.body.ok == 'OK'){
    console.log("in delete upcoming events");
    Notification.deleteOne({_id: req.body.id})
    .exec()
    .then(()=>{res.redirect('/notification')})
    .catch((error)=>{res.send(error)})
  }
};

// get the current user's friend list
exports.getFriend = ( req, res, next ) => {
  Friend.find( {user:res.locals.user.googleemail} )
    .exec()
    .then( ( friend_list ) => {
      res.locals.friend = friend_list
      res.locals.userEmail = res.locals.user.googleemail
      res.locals.userID = res.locals.user._id
      next();
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'get friend complete' );
    } );
};

// get those friends' profile information and display
exports.getFriendProfile = (req, res) => {
  var friends = res.locals.friend;
  var friendEmails = [];
  for(var i = 0; i < friends.length; i ++){
    friendEmails.push(friends[i].friend);
  }
  Profile.find({email: {$in : friendEmails}},
    function(err, profile_list){
      if(err){
        console.log(err.message);
      }
      else{
        res.locals.profiles = profile_list
        res.render('friend')
      }
    }
  )
}

// go the search friend box
exports.searchPage = ( req, res ) => {
  res.render('searchPage');
};

// on  friend page, check availability by person or delete friend
exports.check_avail = (req, res) =>{
  if(req.body.check_avail == "Start Checking"){
    var s = new Date(req.body.checkDate);
    var friendName = req.body.friendName
    var checkDate = req.body.checkDate
    var checkTime = req.body.checkTime
    s.setDate(s.getDate()+1)
    var index = req.body.checkTime.indexOf(":")
    s.setHours(req.body.checkTime.slice(0, index), req.body.checkTime.slice(index + 1, req.body.checkTime.length));
    var start = req.body.checkDate + " " + req.body.checkTime
    Input.find({email:req.body.friendEmail},
      function(err, input_list){
        if(err){
          console.log(err.message);
        } else{
          var checkStatus;
          for(var i = 0; i < input_list.length; i ++){
            if(input_list[i].endTime != null){
              if(input_list[i].start.getTime() <= s.getTime() && s.getTime() <= input_list[i].end.getTime()){
                checkStatus = "BUSY";
              }
            }
            else{
              if(input_list[i].start.getTime() == s.getTime()){
                checkStatus = "BUSY";
              }
            }
          }
          if(checkStatus != "BUSY"){
            checkStatus = "FREE"
          }
          var answer = {checkStatus: checkStatus, friendName: friendName, checkDate: checkDate, checkTime: checkTime}
          res.json(answer);
        }
      }
    )
  }
  else{
    var friendEmail = req.body.friendEmail
    var userEmail = req.body.userEmail
    var pair = [friendEmail, userEmail];
    Friend.deleteMany({
      user: {$in:pair},
      friend: {$in:pair}
    }).exec()
    res.redirect('/friend')
  }
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
  Friend.find({user: req.body.currUser},
    function(err, friend_list){
      if(err){
        console.log(err.message)
      }
      else{
        res.locals.friend_list = friend_list
        next();
      }
    })
  }

// check free friends by time
// problem: if the number of friends and the number of events are large
// it will take long time to finish
exports.guess_free = (req, res) => {
  var freeFriend = [];
  var s = new Date(req.body.checkDate);
  var checkDate = req.body.checkDate
  var checkTime = req.body.checkTime
  s.setDate(s.getDate()+1)
  var index = req.body.checkTime.indexOf(":")
  s.setHours(req.body.checkTime.slice(0, index), req.body.checkTime.slice(index + 1, req.body.checkTime.length));
  var friend_list = res.locals["friend_list"];
  var freeFriend = []
  var x = 0;
  checkWithFriend(friend_list, s, freeFriend, x, res, checkDate, checkTime);
}

// recursive function 
function checkWithFriend(friend_list, s, freeFriend, x, res, checkDate, checkTime){
  var length = friend_list.length
  Input.find({email: friend_list[x]["friend"]},
    function(err, input_list){
      if(err){
        console.log(err.message);
      } else{
        var checkStatus;
        for(var i = 0; i < input_list.length; i ++){
          if(input_list[i].endTime != ""){
            if(input_list[i].start <= s && s <= input_list[i].end){
              checkStatus = "BUSY";
            }
          }
          else{
            if(input_list[i].start.getTime() == s.getTime()){
              checkStatus = "BUSY";
            }
          }
        }
        if(x == friend_list.length - 1 && checkStatus == "BUSY"){
          var response = {freeFriend: freeFriend, checkDate: checkDate, checkTime: checkTime }
          res.json(response)
        }
        if(checkStatus != "BUSY"){
          freeFriend.push(friend_list[x].friendname);
          if(x == friend_list.length - 1){
            var response = {freeFriend: freeFriend, checkDate: checkDate, checkTime: checkTime }
            res.json(response)
          }
          if(x < friend_list.length - 1){
            checkWithFriend(friend_list, s, freeFriend, x + 1, res, checkDate, checkTime)
          }
        }
        else{
          if(x < friend_list.length - 1){
            checkWithFriend(friend_list, s, freeFriend, x + 1, res, checkDate, checkTime)
          }
        }
      }
    }
  )
}
