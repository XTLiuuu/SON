'use strict';
const mongoose = require( 'mongoose' );

var notificationSchema = mongoose.Schema( {
  to: String,
  toname: String,
  content: String,
  from: String,
  fromname: String
} );

module.exports = mongoose.model( 'Notification', notificationSchema );
