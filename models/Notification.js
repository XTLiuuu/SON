'use strict';
const mongoose = require( 'mongoose' );

var notificationSchema = mongoose.Schema( {
  type: String,
  //for friend request
  to: String,
  toname: String,
  content: String,
  from: String,
  fromname: String,

  //for event invitation

  title: String,
  sDate: String,
  sTime: String,
  eDate: String,
  eTime: String,
  description: String
} );

module.exports = mongoose.model( 'Notification', notificationSchema );
