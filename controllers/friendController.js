'use strict';
const Friend = require( '../models/Friend' );
const Profile = require('../models/Profile');
const Input = require('../models/Input');
const Notification = require('../models/Notification');
const mongo = require('mongodb');
console.log("loading the friend Controller")


exports.searchProfile = ( req, res ,next ) => {
  console.log('in searchprofile'+req.body.searchfriend)
  Profile.findOne({email:req.body.searchfriend})
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( friend ) => {
      //console.log("friend"+friend);
      res.render('searchProfile', {friend: friend});
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'profile promise complete' );
    } );
};

exports.sendFrequest = ( req, res ) =>{
  console.log("send friend request");
  //if req.body.searchfriend = null

  let request = new Notification({email:req.body.searchfriend,
                  content: "You have a friend request from "+ res.locals.user.googleemail,
                  from: res.locals.user.googleemail})
  request.save()
    .then( () => {
      console.log("The invitation has been sent")
      //res.redirect( '/searchProfile' );
    } )
    .catch( error => {
      res.send( error );
    } );

};
