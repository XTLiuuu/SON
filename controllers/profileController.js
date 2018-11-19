'use strict';
const Profile = require( '../models/Profile' );
const mongo = require('mongodb');

// display the user's profile
exports.getProfile = ( req, res ) => {
  const objId = new mongo.ObjectId(req.params.id)
  Profile.findOne(objId)
    .exec()
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

// check whether the user input a valid secret to use the voice function
exports.checkSecret = (req, res, next) =>{
  console.log("in check secret")
  // the secret code is empty
  if(req.body.secret.trim() == ""){
    res.json({message: "Please enter a secret.", type: "empty"})
    return;
  }
  // the user inputs a secret code
  Profile.findOne({secret: req.body.secret.trim()},
  function(err, profile){
    if(err){
      res.status(err.status || 500);
      res.json(err.message)
    }
    else{
      // avoid repetitive secret
      if(profile != null && profile.email != res.locals.user.googleemail){
        res.json({message: "The secret code has been used. Please try a new one.", type: "exist"})
        return;
      }
      next();
    }
  })
}

// save user's profile
exports.saveProfile = ( req, res ) => {
  console.log("in saveProfile!")
  Profile.findOne({email:res.locals.user.googleemail})
    .exec()
    .then( ( profile ) => {
      if(profile==null){
        var name = req.user.googlename;
        var firstname = name.substring(0, name.indexOf(" "));
        var lastname = name.substring(name.indexOf(" ") + 1);
        let profile = new Profile ({
          name: req.user.googlename,
          email: req.user.googleemail,
          firstname: firstname,
          lastname: lastname,
          phone: req.body.phone,
          gender: req.body.gender,
          friendEmail: [],
          dob: req.body.dob,
          about: req.body.about,
          home: req.body.home,
          image: req.body.image,
          secret: req.body.secret.toLowerCase().trim(),
        })
        profile.save()
          .then( () => {
            res.redirect( '/setting' );
          } )
          .catch( error => {
            res.send( error );
          });
      } else{
        var curProfile = Profile.findOne({email:res.locals.user.googleemail})
        curProfile.update({email:res.locals.user.googleemail},
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

// attach the current login profile
exports.attachProfile = ( req, res, next ) => {
  console.log("in attach profile")
  Profile.findOne({email:res.locals.user.googleemail})
    .exec()
    .then( ( profile ) => {
      // when the user does not store a profile object yet
      if (profile == null){
        var name = req.user.googlename;
        var firstname = name.substring(0, name.indexOf(" "));
        var lastname = name.substring(name.indexOf(" ") + 1);
        profile = new Profile ({
          name: req.user.googlename,
          email: req.user.googleemail,
          firstname: firstname,
          lastname: lastname,
          phone: req.body.phone,
          gender: req.body.gender,
          dob: req.body.dob,
          about: req.body.about,
          secret: req.body.secret,
          image: req.body.image,
          home: req.body.home,
          friendEmail: []
        } )
      }
      // attach the old profile or the newly constructed profile
      res.locals.profile = profile
      res.locals.friend = profile.friendEmail;
      res.locals.userEmail = res.locals.user.googleemail
      res.locals.userID = res.locals.user._id
      console.log(profile)
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
};
