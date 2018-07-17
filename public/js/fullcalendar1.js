var events =   [{
    title: 'Lunch',
    start: '2018-07-12T12:00:00'
  }]
var events1 =   [{
    title: 'Dinner',
    start: '2018-07-18T18:00:00'
  }]

console.log('in full calendar 1')
$(function() {
  var containerEl = $('#calendar');

<<<<<<< HEAD
  var allEvents = new Array();

  // function loadQuestions() {
  //     $.getJSON('events.json', function (data) {
  //         allQuestions = data.events;
  //     }).error(function(){
  //             console.log('error: json not loaded');
  //         });
  //     });
  // }

=======
  //loading
>>>>>>> 2a4e679490e43091dec3c8d7b6b97b9eb911016a
  containerEl.fullCalendar({
    //themeSystem: 'bootstrap4',
    nowIndicator: true,
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listWeek'
    },
    defaultDate: new Date(),
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    eventSources: [
      {
      url: '/calendar/get_events',
      type: 'POST',
      data: {
        //date: "today"
      },
      error: function() {
        alert('there was an error while fetching events!');
      },
      //color: 'yellow',   // a non-ajax option
      textColor: 'black' // a non-ajax option
    }
    ],
  })

  var calendar = $('#calendar').fullCalendar('getCalendar');
  calendar.on('dayClick', function(date, jsEvent, view){
        console.log('Clicked on: ' + date.format());
        console.log('Current view: ' + view.name);
        //$(this).css('background-color', 'red')
      });

});
