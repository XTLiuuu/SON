'use strict';
const Noti = require( '../models/Notification' );
const mongo = require('mongodb');
const Input = require('../models/Input');
console.log("loading the notification Controller")

// this displays all of the skills
exports.getAllNotis = ( req, res ) => {
  console.log('in getAllNoti')
  Noti.find( {to:res.locals.user.googleemail})
    .exec()
    .then( ( notis ) => {
      res.render( 'notification', {
        notis: notis
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'get all notifications complete' );
    } );
};

exports.getNoti = ( req, res ) => {
  const objId = new mongo.ObjectId(req.params.id)
  console.log('in get notification')
  Noti.findOne(objId)
    .exec()
    //this is a function takes one parameter (function) and does this
    .then( ( noti) => {
      noti: noti
      res.render('notification');
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'notification promise complete' );
    } );
};


exports.attachNoti = ( req, res, next ) => {
  console.log('in attachNoti')
  //const objId = new mongo.ObjectId(req.params.id)
  Input.find({}) //{"_id": objId})
    .exec()
    .then( ( noti ) => {
      res.locals.noti = noti
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      //console.log("profile1=" + res.locals.profile);
      console.log( 'attach notification promise complete' );
    } );
};


// exports.saveNoti = ( req, res ) => {
//   console.log("in save noti!")//after user save the input
//   //console.dir(req)
//   let newNoti = new Noti( {
//     type: req.body.type,
//     title: req.body.title,
//     content: req.body.content
//   } )
//
//   //console.log("input = "+newinput)
//
//   newNoti.save()
//     .then( () => {
//       res.redirect( '/notification' );
//     } )
//     .catch( error => {
//       res.send( error );
//     } );
// };
