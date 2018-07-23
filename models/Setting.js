'use strict';
const mongoose = require( 'mongoose' );

var settingSchema = mongoose.Schema( {
  email: String,
  enableVoice : Boolean,
  timeFormat : String,
  durationSet : String,
  profilePermission : String,
  notifications : String
} );

module.exports = mongoose.model( 'Setting', settingSchema );
