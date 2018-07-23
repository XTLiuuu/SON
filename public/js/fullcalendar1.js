console.log('in full calendar 1')
$(function() {
  var containerEl = $('#calendar');
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
    eventSources:[
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
      textColor: 'black', // a non-ajax option,
    }
    ],
    weekNumbers: true,
    timeFormat: 'H(:mm)',
    displayEventEnd: true,
    fixedWeekCount: false,

    timezone: 'local',
    eventClick: function(event, jsEvent, view){
      $('#modalTitle').html(event.title)
      $('#modalStartTime').html(event.startTime)
      $('#fullCalModal').modal();
    }

  })
  var calendar = $('#calendar').fullCalendar('getCalendar');
  /**
  calendar.on('eventMouseover', function(callEvent, jsEvent, view){
    if(callEvent.end == null){
      alert(callEvent.start.format("hh:mm a") + ": " + callEvent.title)
    }
    else{
      alert(callEvent.start.format("hh:mm a") + " - " + callEvent.end.format("hh:mm a") + ": " + callEvent.title)
    }
  });
  */
  calendar.on('eventClick', function(callEvent, jsEvent, view){
    console.log(callEvent)
    window.open("/calendar/update_event/" + callEvent._id);
  });
});
