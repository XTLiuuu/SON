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
  let request = new Notification({to:req.body.friendemail,
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
  Friend.find( {user:res.locals.user.googleemail} )
    .exec()
    .then( ( friend_list ) => {
      res.locals.friend = friend_list
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
