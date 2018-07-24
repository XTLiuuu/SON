'use strict';
const Setting = require( '../models/Setting' );
const mongo = require('mongodb');
console.log("loading the profile Controller")

// this displays all of the hotel reviews
exports.getSetting = ( req, res ) => {
  const objId = new mongo.ObjectId(req.params.id)
  console.log('in get setting')
  Setting.findOne(objId)
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( setting ) => {
      setting: setting
      res.render('setting');
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'setting promise complete' );
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

exports.saveSetting = ( req, res ) => {
  console.log("in saveSetting!")
  Setting.findOne({email:res.locals.user.googleemail}) //{"_id": objId})
    .exec()
    .then( ( setting ) => {
      if(setting==null){
        console.log("in save!")
        let setting = new Setting ({
          email: req.user.googleemail,
          enableVoice: req.body.enableVoice,
          timeFormat = req.body.timeFormat,
          durationSet = req.body.durationSet,
          profilePermission = req.body.profilePermission,
          notifications = req.body.notifications
        } )
        //console.log("profile = "+ newProfile)
        setting.save()
          .then( () => {
            res.redirect( '/setting' );
          } )
          .catch( error => {
            res.send( error );
          } );
      }else{
        console.log("in update!")
        var uSetting = Setting.findOne({email:res.locals.user.googleemail})
        //console.log(uProfile)
        uProfile.update({email:res.locals.user.googleemail},
          {enableVoice: req.body.enableVoice,
          timeFormat = req.body.timeFormat,
          durationSet = req.body.durationSet,
          profilePermission = req.body.profilePermission,
          notifications = req.body.notifications
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

exports.attachSetting = ( req, res, next ) => {
  console.log('in attachSetting')
  //const objId = new mongo.ObjectId(req.params.id)
  Setting.findOne({email:res.locals.user.googleemail}) //{"_id": objId})
    .exec()
    .then( ( setting ) => {
      if (setting == null){
        console.log("666");
        setting = new Setting ({
          email: req.user.googleemail,
          enableVoice: req.body.enableVoice,
          timeFormat = req.body.timeFormat,
          durationSet = req.body.durationSet,
          profilePermission = req.body.profilePermission,
          notifications = req.body.notifications
        } )
      }
      res.locals.setting = setting
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log("setting=" + res.locals.setting);
      console.log( 'attachSetting promise complete' );
    } );
};
