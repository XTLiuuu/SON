'use strict';
const mongoose = require( 'mongoose' );

var messageSchema = mongoose.Schema( {
  to: String,
  toname: String,
  content: String,
  from: String,
  fromname: String,
  toid: String,
  title: String,
  sDate: String,
  sTime: String,
  eDate: String,
  eTime: String,
  allday: Boolean,
  description: String,

} );

module.exports = mongoose.model( 'Message', messageSchema );
