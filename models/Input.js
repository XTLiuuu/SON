'use strict';
const mongoose = require( 'mongoose' );

<<<<<<< HEAD
var InputSchema = mongoose.Schema( {
  title: String,
  start:Date,
  end: Date,
  id: Number,
  url: String,
  user: String
=======
var inputSchema = mongoose.Schema( {
  email: String,
  title: String,
  start: Date,
  end: Date,
  url: String,
>>>>>>> 77c14a42b0651c13047810aa9f7faea84a9bdaa5
} );

module.exports = mongoose.model( 'Input', InputSchema );
