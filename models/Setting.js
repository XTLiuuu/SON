'use strict';
const mongoose = require( 'mongoose' );

var settingSchema = mongoose.Schema( {
  email: String,
  voice : Boolean,
  timeFormat : String,
  durationSet : String,
  profilePermission : String,
  notimethod : String,
  weekend: Boolean,
  weeknumber: Boolean,
  eventEnd: Boolean,
  fixedWeek: Boolean,
  view: String,
  color: String
} );

module.exports = mongoose.model( 'Setting', settingSchema );
