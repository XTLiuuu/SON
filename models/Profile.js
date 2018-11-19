'use strict';
const mongoose = require( 'mongoose' );

var profileSchema = mongoose.Schema( {
  name: String,
  firstname: String,
  lastname: String,
  email: String,
  home: String,
  phone: String,
  gender: String,
  dob: String,
  about: String,
  friend: Array,
  secret: String,
  image: String,
  amazon: String,
  dialogflow: String,
  friendGroup: Array
} );

module.exports = mongoose.model( 'Profile', profileSchema );
