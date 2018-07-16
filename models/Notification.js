'use strict';
const mongoose = require( 'mongoose' );

var notificationSchema = mongoose.Schema( {
  type: String,
  title: String,
  content: String,
  email: String
} );

module.exports = mongoose.model( 'Notification', notificationSchema );
