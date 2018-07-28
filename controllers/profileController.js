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
  console.log("in check Secret");
  if(req.body.secret.trim() == null){
    res.locals.message = "Please enter a secret code"
    res.redirect('/updateProfile')
  }
  else if(req.body.secret.indexOf(" ") > 0){
    res.locals.message = "Please enter a valid code. Include only lowercase letters and numbers"
    res.redirect('/updateProfile')
  }
  Profile.findOne({secret: req.body.secret},
  function(err, profile){
    if(err){
      console.log(err.message)
    }
    else{
      if(profile != null){
        var message = "The secret code has been used. Please enter a new one."
        res.locals.message = message;
        res.redirect('/updateProfile')
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
           secret: req.body.secret.toLowerCase().trim(),
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

exports.check_secret = (req, res) =>{
  if(!req.body.keycode.trim()){
    res.status(400);
    res.json({message: "Please enter a keycode."})
  }

  Profile.findOne({keycode: req.body.keycode.trim()}, function(err, result){
    if(err){
      res.status(err.status || 500);
      res.json(err);
    } else {
      if(result){
        // keycode has been used
        res.status(400);
        res.json({});
      } else {
        //update keycode

        result.keycode = req.body.keycode.trim();
      }
    }
  })


  console.log("in check_secret");
  var secret = req.body.secret;
  var response;
  if(secrets.contains(secret)){
    response = "exist"
    res.json(response)
  }
  else{
    response = 'new'
    res.json(response)
  }
}
