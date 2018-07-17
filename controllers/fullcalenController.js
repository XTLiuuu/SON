'use strict';
console.log("in full calendar controller")

exports.getCalendar = (req, res) => {
  /**
  events = [
    { date: '2013-09-09', title: 'CLNDR GitHub Page Finished', url: 'http://github.com/kylestetz/CLNDR' },
    { date: '2018-07-09', title: 'This is just a test', url: 'http://github.com/kylestetz/CLNDR' }
  ]
  //console.log("events = " + events[0].date)
  */
  res.render('calendarD');
  //res.render('calendar', {days: days, daysOfTheWeek: daysOfTheWeek});
};
