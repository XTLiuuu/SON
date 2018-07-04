'use strict';
const Profile = require( '../models/profile' );
const mongo = require('mongodb');
console.log("loading the profile Controller")

// this displays all of the hotel reviews
exports.getProfile = ( req, res ) => {
  const objId = new mongo.ObjectId(req.params.id)
  console.log('in getUser')
  Profile.findOne(objId)
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( profile ) => {
      console.log("profile = ")
      console.dir(profile)
      res.render( 'profile', {
        profile: profile
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'profile promise complete' );
    } );
};

exports.saveProfile = ( req, res ) => {
  console.log("in saveProfile!")
  console.dir(req)
  let newProfile = new Profile ({
    name: req.user.googlename,
    email: req.user.googleemail,
    phone: req.body.phone,
    gender: req.body.gender,
    dob: req.body.dob,
    fav: req.body.fav
  } )
  console.log("profile = "+ newProfile)

  newProfile.save()
    .then( () => {
      res.redirect( '/profile' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.attachProfile = ( req, res, next ) => {
  console.log('in attachProfile')
  const objId = new mongo.ObjectId(req.params.id)
  Profile.findOne(objId) //{"_id": objId})
    .exec()
    .then( ( profile ) => {
      res.locals.profile = req.profile
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log(res.locals.user.googleemail);
      console.log( 'attachProfile promise complete' );
    } );
};
