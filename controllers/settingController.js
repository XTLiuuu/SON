'use strict';
const Setting = require( '../models/Setting' );
const Profile = require( '../models/Profile' );
const mongo = require('mongodb');

// display user's setting
exports.getSetting = ( req, res, next ) => {
  const objId = new mongo.ObjectId(req.params.id)
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
};

// include save setting for the first time and update it later
exports.saveSetting = ( req, res ) => {
  Setting.findOne({email:res.locals.user.googleemail})
    .exec()
    .then( ( setting ) => {
      // change the "on" and "off" of the checkbox to boolean
      var enablev = false;
      if(req.body.voice == 'on') enablev = true
      var weekend = false;
      if(req.body.weekend == 'on') weekend = true
      var weeknumber = false;
      if(req.body.weeknumber == 'on') weeknumber = true
      var eventEnd = false;
      if(req.body.eventEnd == 'on') eventEnd = true
      var fixedWeek = false
      if(req.body.fixedWeek == 'on') fixedWeek = true
      // create a new setting object when the user saves the first time
      if(setting==null){
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
      // save the new setting and redirect
      setting.save()
        .then( () => {
          res.redirect( '/setting' );
        } )
        .catch( error => {
          res.send( error );
        } );
      }
      // update the existing setting
      else{
        var curSetting = Setting.findOne({email:res.locals.user.googleemail})
        curSetting.update({email:res.locals.user.googleemail},
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
    })
};
