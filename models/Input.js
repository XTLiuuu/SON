'use strict';
const mongoose = require( 'mongoose' );

var inputSchema = mongoose.Schema( {
  email: String,
  content: String
} );

module.exports = mongoose.model( 'Input', inputSchema );
