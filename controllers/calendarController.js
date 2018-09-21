'use strict';

exports.getCalendar = (req, res) => {
  /**
  events = [
    { date: '2013-09-09', title: 'CLNDR GitHub Page Finished', url: 'http://github.com/kylestetz/CLNDR' },
    { date: '2018-07-09', title: 'This is just a test', url: 'http://github.com/kylestetz/CLNDR' }
  ]
  //console.log("events = " + events[0].date)
  */
  var aLongEvent = [
    {
      end: '2018-07-20',
      start: '2018-07-16',
      title: 'lose weight',
    }, {
      end: '2018-06-20',
      start: '2018-06-15',
      title: 'buy makeups'
    },
    {
      date: '2018-07-02',
      title: 'this is a secret'
    }
  ]
  res.render('calendar', {aLongEvent: aLongEvent});
  //res.render('calendar', {days: days, daysOfTheWeek: daysOfTheWeek});
};
