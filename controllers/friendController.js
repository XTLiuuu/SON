'use strict';
const Friend = require( '../models/Friend' );
const Profile = require('../models/Profile');
const Input = require('../models/Input');
const Notification = require('../models/Notification');
const mongo = require('mongodb');

// use to add new friend
exports.searchProfile_post = ( req, res ) => {
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

// used to add new friend
exports.searchProfile_get = ( req, res  ) => {
  res.render('searchProfile');
};

exports.sendFrequest = ( req, res ) =>{
  if(req.body.friendemail == res.locals.profile.email){
    // when the input email is the same as the current user's email
    res.json("same");
    return;
  }
  Friend.find({
    user: res.locals.profile.email,
    friend: req.body.friendemail,
  },function(err, result){
    if(err){
      res.status(err.status || 500)
      console.log(err.message);
      return;
    } else{
      if(result.length != 0){
        // when these two people have been friends already
        res.json("exist")
        return;
      }
      else{
        // the friend request can be sent
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

exports.attachCurrFriend = ( req, res, next ) => {
  const friend_id = req.params.friend_id;
  Profile.findOne({_id: friend_id},
    function(err, friend){
      if(err){
        console.log(err.message)
      }
      else{
        console.log(friend)
        res.locals.friendName = friend["name"]
        console.log(res.locals.friendName)
        next();
      }
    })
  }

// go the search friend box
exports.searchPage = ( req, res ) => {
  res.render('addFriends');
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

// find the current user's friends
exports.attachFriend = ( req, res, next ) => {
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
  // check the friend's events (the current friend is the one with index x)
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
        // if the current friend is free, we push it
        if(checkStatus != "BUSY"){
          freeFriend.push(friend_list[x].friendname);
          // if this is the last person
          if(x == friend_list.length - 1){
            var response = {freeFriend: freeFriend, checkDate: checkDate, checkTime: checkTime }
            res.json(response)
          }
          // if this is not the last person
          if(x < friend_list.length - 1){
            checkWithFriend(friend_list, s, freeFriend, x + 1, res, checkDate, checkTime)
          }
        }
        // if he is busy, we go to check the next person
        else{
          if(x < friend_list.length - 1){
            checkWithFriend(friend_list, s, freeFriend, x + 1, res, checkDate, checkTime)
          }
        }
      }
    }
  )
}
