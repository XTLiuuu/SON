'use strict';
const Setting = require( '../models/Setting' );
const mongo = require('mongodb');
console.log("loading the setting Controller")

// this displays all of the hotel reviews
exports.getSetting = ( req, res, next ) => {
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

exports.saveSetting = ( req, res ) => {
  console.log("hh24567" + req.body.timeFormat)
  console.log(req.body)
  console.log("in saveSetting!")
  Setting.findOne({email:res.locals.user.googleemail}) //{"_id": objId})
    .exec()
    .then( ( setting ) => {
      var es = req.body.voice;
      var enablev;
      if(es == 'on'){
        enablev = true;
      } else {
        enablev = false;
      }

      var wk = req.body.weekend;
      var weekend;
      if(wk == 'on'){
        weekend = true;
      } else {
        weekend = false;
      }

      var wkn = req.body.weeknumber;
      var weeknumber;
      if(wkn == 'on'){
        weeknumber = true;
      } else {
        weeknumber = false;
      }

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

exports.attachSetting = ( req, res, next ) => {
  console.log('in attachSetting')
  //const objId = new mongo.ObjectId(req.params.id)
  Setting.findOne({email:res.locals.user.googleemail}) //{"_id": objId})
    .exec()
    .then( ( setting ) => {
      var es = req.body.voice;
      var enablev;
      if(es == 'on'){
        enablev = true;
      } else {
        enablev = false;
      }

      var wk = req.body.weekend;
      var weekend;
      if(wk == 'on'){
        weekend = true;
      } else {
        weekend = false;
      }

      var wkn = req.body.weeknumber;
      var weeknumber;
      if(wkn == 'on'){
        weeknumber = true;
      } else {
        weeknumber = false;
      }

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


      if (setting == null){
        console.log("666");
        setting = new Setting ({
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
