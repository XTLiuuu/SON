'use strict';
const mongoose = require( 'mongoose' );

var profileSchema = mongoose.Schema( {
  name: String,
  email: String,
  home: String,
  phone: String,
  gender: String,
  dob: String,
  about: String,
  friendEmail: Array,
  secret: String,
  image: String,
} );

module.exports = mongoose.model( 'Profile', profileSchema );
