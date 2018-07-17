'use strict';
const mongoose = require( 'mongoose' );
var inputSchema = mongoose.Schema( {
  email: String,
  title: String,
  start: Date,
  end: Date,
  url: String,
} );

module.exports = mongoose.model( 'Input', inputSchema );
