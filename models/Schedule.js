'use strict';
const mongoose = require( 'mongoose' );

// we might need this models later to store event
var scheduleSchema = mongoose.Schema( {
  count: Number,
  time: String,
  date: String,
  date1: Date, //used for calculate duration 
  schedule: String
} );

module.exports = mongoose.model( 'Schedule', scheduleSchema );
