'use strict';
const mongoose = require( 'mongoose' );

var profileSchema = mongoose.Schema( {
  name: String,
  email: String,
  phone: String,
  gender: String,
  dob: String,
  fav: String,
} );

module.exports = mongoose.model( 'Profile', profileSchema );
