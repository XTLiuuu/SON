'use strict';
const Profile = require( '../models/profile' );
const mongo = require('mongodb');
console.log("loading the profile Controller")

// this displays all of the hotel reviews
exports.getProfile = ( req, res ) => {
  const objId = new mongo.ObjectId(req.params.id)
  console.log('in getprofile')
  Profile.findOne(objId)
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( profile ) => {
      profile: profile
      res.render('profile');
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
        } )
        //console.log("profile = "+ newProfile)
        profile.save()
          .then( () => {
            res.redirect( '/profile' );
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
           dob: req.body.dob})
          .exec()
          .then( () => {
            res.redirect( '/profile' );
          } )
          .catch( error => {
            res.send( error );
          });
        }
        });
      };

  /*
  if(res.locals.profile==null){
    console.log("in save!")
    let newProfile = new Profile ({
      name: req.user.googlename,
      email: req.user.googleemail,
      phone: req.body.phone,
      gender: req.body.gender,
      dob: req.body.dob,
    } )
    //console.log("profile = "+ newProfile)
    newProfile.save()
      .then( () => {
        res.redirect( '/profile' );
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
       dob: req.body.dob})
      .exec()
      .then( () => {
        res.redirect( '/profile' );
      } )
      .catch( error => {
        res.send( error );
      } );
  }
  //console.dir(req)
*/

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
