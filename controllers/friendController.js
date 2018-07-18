'use strict';
const Friend = require( '../models/Friend' );
const Profile = require('../models/Profile');
const Input = require('../models/Input')
const mongo = require('mongodb');
console.log("loading the profile Controller")




exports.searchProfile = ( req, res, next ) => {
  console.log('in searchprofile'+req.body.searchfriend)
  Profile.findOne({email:req.body.searchfriend})
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( friend ) => {
      //console.log("friend"+friend);
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

exports.sendFrequest = ( req, res ) =>{
  console.log("send friend request");
  //if req.body.searchfriend = null

  let request = new Input({email:friend.email,
                  content: "You have a friend request from"})
  request.save()
    .then( () => {
      res.redirect( '/searchProfile' );
    } )
    .catch( error => {
      res.send( error );
    } );

};
