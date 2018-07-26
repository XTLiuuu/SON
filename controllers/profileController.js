'use strict';
const Profile = require( '../models/Profile' );
const mongo = require('mongodb');
console.log("loading the profile Controller")

// this displays all of the hotel reviews
exports.getProfile = ( req, res, next ) => {
  const objId = new mongo.ObjectId(req.params.id)
  console.log('in getprofile')
  Profile.findOne(objId)
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( profile ) => {
      profile: profile
      res.render('setting');
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'profile promise complete' );
    } );
};

// this displays all of the hotel reviews
exports.getProfile1 = ( req, res ) => {
  const objId = new mongo.ObjectId(req.params.id)
  console.log('in getprofile')
  Profile.findOne(objId)
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( profile ) => {
      profile: profile
      res.render('setting1');
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
  Profile.findOne({email:res.locals.user.googleemail}) //{"_id": objId})
    .exec()
    .then( ( profile ) => {
      if(profile==null){
        console.log("in save!")
        let profile = new Profile ({
          name: req.user.googlename,
          email: req.user.googleemail,
          phone: req.body.phone,
          gender: req.body.gender,
          dob: req.body.dob,
          about: req.body.about,
          home: req.body.home,
          friendEmail: []
        } )
        //console.log("profile = "+ newProfile)
        profile.save()
          .then( () => {
            res.redirect( '/setting' );
          } )
          .catch( error => {
            res.send( error );
          } );
      }else{
        console.log("in update!")
        var uProfile = Profile.findOne({email:res.locals.user.googleemail})
        //console.log(uProfile)
        uProfile.update({email:res.locals.user.googleemail},
          {phone: req.body.phone,
           gender: req.body.gender,
           dob: req.body.dob,
           about: req.body.about,
           home: req.body.home
         })
          .exec()
          .then( () => {
            res.redirect( '/setting' );
          } )
          .catch( error => {
            res.send( error );
          });
        }
        });
      };

exports.attachProfile = ( req, res, next ) => {
  console.log('in attachProfile')
  //const objId = new mongo.ObjectId(req.params.id)
  Profile.findOne({email:res.locals.user.googleemail}) //{"_id": objId})
    .exec()
    .then( ( profile ) => {
      if (profile == null){
        console.log("666");
        profile = new Profile ({
          name: req.user.googlename,
          email: req.user.googleemail,
          phone: req.body.phone,
          gender: req.body.gender,
          dob: req.body.dob,
          about: req.body.about,
          home: req.body.home,
          friendEmail: req.body.friendEmail
        } )
      }
      res.locals.profile = profile
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log("profile1=" + res.locals.profile);
      console.log( 'attachProfile promise complete' );
    } );
};
