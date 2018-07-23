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
  let request = new Notification({email:req.body.friendemail,
                  content: "You have a friend request from "+ res.locals.user.googleemail,
                  from: res.locals.user.googleemail})
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
      friend:req.body.from,
      status:"friend",
    })

    let newf2 = new Friend({
      user:req.body.from,
      friend:res.locals.user.googleemail,
      status:"friend"
    })

    newf2.save()
    newf.save()

    Notification.deleteOne({
                email: res.locals.user.googleemail,
                from:req.body.from})
                .then( () => {
                  res.redirect('/notification');
                })
                .catch( error => {
                  res.send( error );
                });
  }else if(req.body.cancel == 'Cancel'){
    console.log("in deleteRequest"+req.body.from);
    Notification.deleteOne({email: res.locals.user.googleemail,
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
    .then( ( friend ) => {
      res.render( 'friend', {
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
