'use strict';
const mongoose = require( 'mongoose' );
//const Event1 = require('../models/Event1');

var calendarSchema = mongoose.Schema( {
  view: String,
  viewDate: Date,
  events: Object,
  viewTitle: String,
  eventClicked: String,
  eventTimesChanged: String,
  cellIsOpen: Boolean
} );

module.exports = mongoose.model( 'Calendar', calendarSchema );
