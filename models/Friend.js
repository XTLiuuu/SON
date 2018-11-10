'use strict';
const mongoose = require( 'mongoose' );

var friendSchema = mongoose.Schema( {
  user: String,
  username: String,
  friend: String,
  friendname: String,
  lastname: String,
  firstname: String,
  status: String,
  group: String, 
} );

module.exports = mongoose.model( 'Friend', friendSchema );
//Friend is the name of the colllection
