'use strict';
const mongoose = require( 'mongoose' );
var inputSchema = mongoose.Schema( {
  email: String,
  id: String,
  title: String,
  allDay: Boolean,
  start: Date, // include date and time
  end: Date,
  editable: Boolean, //drag
  overlap: Boolean,
  color: String,
  timezone: String
} );

module.exports = mongoose.model( 'Input', inputSchema );
