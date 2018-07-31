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
      /*Profile.findOne({email: req.body.friendemail})
                  .exec()
                  .then( (rr) => {
                    if(rr==null){
                      console.log("Sorry, the email your searched has not registered yet.")
                      res.redirect( '/friend' );
                    }
                  })
      */
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
  console.log("send friend request1");
  console.log(req.body.friendemail)
  console.log(res.locals.profile.email)
  //console.log(req.locals.user.googleemail)
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

exports.getFriend = ( req, res, next ) => {
  console.log('in getAllNoti')
  console.log('checkStatus=' + res.locals.checkStatus)
  console.log('checkStatus1=' + res.checkStatus)
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

exports.getFriendProfile = (req, res) => {
  console.log('in get friend profile');
  console.log(res.locals.friend)
  var friends = res.locals.friend;
  var friendEmails = [];
  for(var i = 0; i < friends.length; i ++){
    friendEmails.push(friends[i].friend);
  }
  console.log(friendEmails);
  Profile.find({email: {$in : friendEmails}},
    function(err, profile_list){
      if(err){
        console.log(err.message);
      }
      else{
        console.log("after getting friend profiles")
        console.log(profile_list)
        res.locals.profiles = profile_list
        res.render('friend')
      }
    }
  )
}

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
  if(req.body.check_avail == "Start Checking"){
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
            console.log("list " + i + " startTime = " + input_list[i].start)
            console.log("list " + i + " endTime = " + input_list[i].end)
            if(input_list[i].endTime != null){
              if(input_list[i].start.getTime() <= s.getTime() && s.getTime() <= input_list[i].end.getTime()){
                console.log("input meet is " + input_list[i]);
                checkStatus = "BUSY";
              }
            }
            else{
              console.log(input_list[i].start == s)
              console.log(input_list[i].start.getTime() == s.getTime())
              if(input_list[i].start.getTime() == s.getTime()){
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
  else{
    console.log("in delete friends")
    var friendEmail = req.body.friendEmail
    var userEmail = req.body.userEmail
    var pair = [friendEmail, userEmail];
    console.log(pair)
    console.log(userEmail)
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

exports.guess_free = (req, res) => {
  console.log('in guess_free')
  console.dir(req.body)
  console.log(res.locals["friend_list"])
  var freeFriend = [];
  var s = new Date(req.body.checkDate);
  var checkDate = req.body.checkDate
  var checkTime = req.body.checkTime
  s.setDate(s.getDate()+1)
  var index = req.body.checkTime.indexOf(":")
  s.setHours(req.body.checkTime.slice(0, index), req.body.checkTime.slice(index + 1, req.body.checkTime.length));
  console.log("s = " + s)
  var friend_list = res.locals["friend_list"];
  console.log(friend_list.length)
  var freeFriend = []
  var x = 0;
  checkWithFriend(friend_list, s, freeFriend, x, res, checkDate, checkTime);
}

function checkWithFriend(friend_list, s, freeFriend, x, res, checkDate, checkTime){
  console.log("in check with friend" + x)
  var length = friend_list.length
  console.log("length 12 = " + length);
  Input.find({email: friend_list[x]["friend"]},
    function(err, input_list){
      if(err){
        console.log(err.message);
      } else{
        console.log("after getting friend " + x);
        console.log("length = " + input_list.length);
        var checkStatus;
        console.log("s = " + s)
        for(var i = 0; i < input_list.length; i ++){
          console.log("list " + i + " startTime = " + input_list[i].start)
          console.log("list " + i + " endTime = " + input_list[i].end)
          if(input_list[i].endTime != ""){
            console.log("have end time")
            if(input_list[i].start <= s && s <= input_list[i].end){
              console.log("input meet is " + input_list[i]);
              checkStatus = "BUSY";
            }
          }
          else{
            console.log("do not have end time")
            console.log(input_list[i].start == s)
            console.log(input_list[i].start.getTime() == s.getTime())
            if(input_list[i].start.getTime() == s.getTime()){
              console.log("input1 meet is " + input_list[i]);
              checkStatus = "BUSY";
            }
          }
        }
        if(x == friend_list.length - 1 && checkStatus == "BUSY"){
          console.log("the final free friend_list0 = ")
          console.log(freeFriend)
          //res.locals.freeFriend = freeFriend
          var response = {freeFriend: freeFriend, checkDate: checkDate, checkTime: checkTime }
          res.json(response)
        }
        console.log("checkStatus at end is " + checkStatus)
        if(checkStatus != "BUSY"){
          console.log(friend_list[x])
          console.log(friend_list[x].friendname)
          console.log(friend_list[x]["friendname"])
          freeFriend.push(friend_list[x].friendname);
          console.log("before freefriend")
          console.log(freeFriend)
          if(x == friend_list.length - 1){
            console.log("the final free friend_list1 = ")
            console.log(freeFriend)
            var response = {freeFriend: freeFriend, checkDate: checkDate, checkTime: checkTime }
            //res.locals.freeFriend = freeFriend
            res.json(response)
          }
          if(x < friend_list.length - 1){
            console.log("call again in free")
            checkWithFriend(friend_list, s, freeFriend, x + 1, res, checkDate, checkTime)
          }
        }
        else{
          if(x < friend_list.length - 1){
            console.log("call again in busy")
            checkWithFriend(friend_list, s, freeFriend, x + 1, res, checkDate, checkTime)
          }
        }
      }
    }
  )
}
