$(document).ready(function(){
  $('.cal1').clndr({
    //template: $('.calendar-div').html(),
    events: [
      { date: '2013-09-09', title: 'CLNDR GitHub Page Finished', url: 'http://github.com/kylestetz/CLNDR' },
      { date: '2018-07-09', title: 'This is just a test', url: 'http://github.com/kylestetz/CLNDR' }
    ],
    daysOfTheWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    clickEvents: {
      click: function(target) {
        console.log(target);
        console.log("show modal now!")
      },
      onMonthChange: function(month) {
        console.log('you just went to ' + month.format('MMMM, YYYY'));
      }
    },
    doneRendering: function() {
      console.log('this would be a fine place to attach custom event handlers.');
    },
  })
})
