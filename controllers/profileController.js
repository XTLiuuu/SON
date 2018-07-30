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

exports.checkSecret = (req, res, next) =>{
  console.log("in check Secret1");
  console.log("secret = " + req.body.secret.trim())
  console.log(req.body.secret.trim() == null)
  console.log(req.body.secret.trim() == "")
  console.log(req.body.secret.trim() == undefined)
  if(req.body.secret.trim() == ""){
    console.log("here1")
    //res.status(400);
    res.json({message: "Please enter a secret.", type: "empty"})
    return;
  }
  Profile.findOne({secret: req.body.secret.trim()},
  function(err, profile){
    if(err){
      res.status(err.status || 500);
      res.json(err.message)
    }
    else{
      console.log("user = " + res.locals.user.googleemail)
      if(profile != null && profile.email != res.locals.user.googleemail){
        console.log(profile.email)
        res.json({message: "The secret code has been used. Please try a new one.", type: "exist"})
        return;
      }
      next();
    }
  })
}

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
          image: req.body.image,
          secret: req.body.secret.toLowerCase().trim(),
        })
        //console.log("profile = "+ newProfile)
        profile.save()
          .then( () => {
            res.redirect( '/setting' );
          } )
          .catch( error => {
            res.send( error );
          });
      } else{
        console.log("in update!")
        var uProfile = Profile.findOne({email:res.locals.user.googleemail})
        //console.log(uProfile)
        uProfile.update({email:res.locals.user.googleemail},
          {phone: req.body.phone,
           gender: req.body.gender,
           dob: req.body.dob,
           about: req.body.about,
           home: req.body.home,
           image: req.body.image,
           secret: req.body.secret.toLowerCase().trim(),
         }, function(err){
           if(err){
             res.status(err.status || 500);
             res.json(err);
           } else {
             res.json({});
           }
         })
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
          secret: req.body.secret,
          image: req.body.image,
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
