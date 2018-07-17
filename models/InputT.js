'use strict';
const mongoose = require( 'mongoose' );

var inputTSchema = mongoose.Schema( {
  email: String,
  title: String,
  startTime: String
} );

module.exports = mongoose.model( 'Input', inputTSchema );
