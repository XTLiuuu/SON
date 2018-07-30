'use strict';
const mongoose = require( 'mongoose' );

var userSchema = mongoose.Schema( {
  name: String,
  password: String,
  googleid: String,
  googletoken: String,
  googlename:String,
  googleemail:String,
} );

module.exports = mongoose.model( 'user', userSchema );
