'use strict';
const vm = require('../models/Calendar');
console.log("in calendar controller")

exports.getCalendar = (req, res) => {
  /**
  const days = [
    {
      day: 1,
      events: [],
      classes: "day",
      date: new Date("2015-12-31")
    },
    {
      day: 2,
      events: [],
      classes: "day",
      date: new Date("2016-1-1")
    },
  ]
  const daysOfTheWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  */
  res.render('calendar');
  //res.render('calendar', {days: days, daysOfTheWeek: daysOfTheWeek});
};
