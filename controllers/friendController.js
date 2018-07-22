'use strict';
const Friend = require( '../models/Friend' );
const Profile = require('../models/Profile');
const Input = require('../models/Input');
const Notification = require('../models/Notification');
const mongo = require('mongodb');
console.log("loading the friend Controller")

let searchfriendemail;

exports.searchProfile_post = ( req, res ) => {
  console.log('in searchprofile'+req.body.searchfriend)
  Profile.findOne({email:req.body.searchfriend})
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( friend ) => {
      //console.log("friend"+friend);
      searchfriendemail = req.body.searchfriend;
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
  let request = new Notification({email:searchfriendemail,
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

exports.deleteRequest = ( req, res) =>{
  console.log("in deleteRequest"+res.locals.noti);
  Notification.deleteOne({from:noti.email})
              .exec()
              .then(()=>{res.direct('/notification')})
              .catch((error)=>{res.send(error)})

};

exports.acceptRequest = ( req, res ) => {
  console.log("in acceptRequest");
  let newf = new Friend({
    user:"hh",
    friend:"haha",
    status:"friend",
  })
  newf.save()
    .then( () => {
      res.redirect('/notification');
    })
    .catch( error => {
      res.send( error );
    });
};
