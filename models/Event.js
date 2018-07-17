'use strict';
const mongoose = require( 'mongoose' );

var eventSchema = mongoose.Schema( {
  title: String,
  start:Date,
  end: Date,
  id: Number,
  url: String,
  user: {
    type: Schema.ObjectId,
    ref: 'user',
    required: true
   }
} );

module.exports = mongoose.model( 'Event', eventSchema );
