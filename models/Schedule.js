'use strict';
const mongoose = require( 'mongoose' );

// we might need this models later to store event
var scheduleSchema = mongoose.Schema( {
  count: Number,
  time: String,
  date: String,
<<<<<<< HEAD
=======
  date1: Date, //used for calculate duration 
>>>>>>> a87abd76825745909e57b53fd72b2ae065b290b3
  schedule: String
} );

module.exports = mongoose.model( 'Schedule', scheduleSchema );
