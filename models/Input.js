'use strict';
const mongoose = require( 'mongoose' );

var InputSchema = mongoose.Schema( {
  title: String,
  start:Date,
  end: Date,
  id: Number,
  url: String,
  user: String
} );

module.exports = mongoose.model( 'Input', InputSchema );
