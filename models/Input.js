'use strict';
const mongoose = require( 'mongoose' );

var inputSchema = mongoose.Schema( {
  content: String
} );

module.exports = mongoose.model( 'Input', inputSchema );
