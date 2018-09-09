'use strict';
const Setting = require( '../models/Setting' );
const Profile = require( '../models/Profile' );
const mongo = require('mongodb');
console.log("loading the setting Controller")

// display user's setting
exports.getSetting = ( req, res, next ) => {
  const objId = new mongo.ObjectId(req.params.id)
  console.log('in getSetting')
  Setting.findOne(objId)
    .exec()
    .then( ( setting ) => {
        setting: setting
        res.render('setting');
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'getSetting promise complete' );
    } );
};

exports.saveSetting = ( req, res ) => {
  console.log("hh24567" + req.body.timeFormat)
  console.log(req.body)
  console.log("in saveSetting!")
  Setting.findOne({email:res.locals.user.googleemail})
    .exec()
    .then( ( setting ) => {
      var enablev = false;
      if(req.body.voice == 'on') enablev = true

      var weekend = false;
      if(req.body.weekend == 'on') weekend = true

      var weeknumber = false;
      if(req.body.weeknumber == 'on') weeknumber = true

      var eve = req.body.eventEnd;
      var eventEnd;
      if(eve == 'on'){
        eventEnd = true;
      } else {
        eventEnd = false;
      }

      var fw = req.body.fixedWeek;
      var fixedWeek;
      if(fw == 'on'){
        fixedWeek = true;
      } else {
        fixedWeek = false;
      }

      if(setting==null){
        console.log("in save!")
        let setting = new Setting ({
          email: res.locals.user.googleemail,
          voice: enablev,
          timeFormat : req.body.timeFormat,
          durationSet : req.body.durationSet,
          profilePermission : req.body.profilePermission,
          notimethod : req.body.notimethod,
          weekend : weekend,
          weeknumber : weeknumber,
          eventEnd : eventEnd,
          fixedWeek : fixedWeek,
          view : req.body.view,
          color : req.body.color
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
        uSetting.update({email:res.locals.user.googleemail},
          { voice: enablev,
          timeFormat : req.body.timeFormat,
          durationSet : req.body.durationSet,
          profilePermission : req.body.profilePermission,
          notimethod : req.body.notimethod,
          weekend : weekend,
          weeknumber : weeknumber,
          eventEnd : eventEnd,
          fixedWeek : fixedWeek,
          view : req.body.view,
          color : req.body.color
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

// attach the current login user's setting
exports.attachSetting = ( req, res, next ) => {
  console.log('in attachSetting')
  Setting.findOne({email:res.locals.user.googleemail})
    .exec()
    .then( ( setting ) => {
      // when the user does not have a saved setting yet
      if (setting == null){
        setting = new Setting ({
          email: res.locals.user.googleemail,
          voice: req.body.voice,
          timeFormat: req.body.timeFormat,
          durationSet: req.body.durationSet,
          profilePermission: req.body.profilePermission,
          notimethod: req.body.notimethod,
          weekend: req.body.weekend,
          weeknumber: req.body.weeknumber,
          eventEnd: req.body.eventEnd,
          fixedWeek: req.body.fixedWeek,
          view: req.body.view,
          color: req.body.color
        } )
      }
      // we attach the newly built setting object or the found setting
      res.locals.setting = setting
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'attachSetting promise complete' );
    } );
};
