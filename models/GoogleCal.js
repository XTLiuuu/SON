'use strict';
const mongoose = require( 'mongoose' );
var googleCalSchema = mongoose.Schema( {
  email: String,
  title: String,
} );

module.exports = mongoose.model( 'GoogleCal', googleCalSchema );
