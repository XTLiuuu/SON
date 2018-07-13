'use strict';
const mongoose = require( 'mongoose' );

var friendSchema = mongoose.Schema( {
  name: String,
  email: String,
  phone: String,
  gender: String,
  dob: String,
} );

module.exports = mongoose.model( 'Friend', friendSchema );
