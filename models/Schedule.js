'use strict';
const mongoose = require( 'mongoose' );

// we might need this models later to store event
var scheduleSchema = mongoose.Schema( {
  count: Number,
  time: String,
  date: Date,
  schedule: String
} );

module.exports = mongoose.model( 'Schedule', scheduleSchema );
