'use strict';
const mongoose = require( 'mongoose' );

var notificationSchema = mongoose.Schema( {
  email: String,
  content: String,
  from: String
} );

module.exports = mongoose.model( 'Notification', notificationSchema );
