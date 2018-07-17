'use strict';
const mongoose = require( 'mongoose' );

var event1Schema = mongoose.Schema( {
  title: String,
  startAt: Date,
  endsAt: Date,
  color: Object,
  actions: Object,
  draggable: Boolean,
  resizable: Boolean,
  incrementBadgeTotal: Boolean,
  recursOn: String,
  cssClass: String,
  allDay: Boolean,
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'user',
  //   required: true,
  // }
} );

module.exports = mongoose.model( 'Event1', event1Schema );
