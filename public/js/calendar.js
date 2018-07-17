// event 加不进去
// event 没有时间
// 无法转换视图
var aLongEvent = [
    {
      endDate: '2018-07-20',
      startDate: '2018-07-18',
      title: 'lose weight',
    }, {
      endDate: '2018-06-20',
      startDate: '2018-06-15',
      title: 'buy makeups'
    },
    {
      date: '2018-06-17',
      title: 'plant potato'
    },
    {
      date: '2018-07-02',
      title: 'this is a secret'
    }
  ]

$(document).ready(function(){
  $('.cal1').clndr({
    //template: $('.calendar-div').html(),
    events: aLongEvent,
    multiDayEvents:{
      endDate: 'endDate',
      startDate: 'startDate',
      singleDay: 'date'
    },
    daysOfTheWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    clickEvents: {
      click: function(target) {
        console.log(target);
        console.log("show modal now!")
        console.log(target.date._i);
        for(var i = 0; i< target.events.length; i ++){
          console.log(target.events[i].title)
        }
      },
      onMonthChange: function(month) {
        console.log('you just went to ' + month.format('MMMM, YYYY'));
      }
    },
    doneRendering: function() {
      console.log('this would be a fine place to attach custom event handlers.');
    },
    lengthOfTime:{
      months: null,
      // 7的倍数
      days: 7,
      interval: 7
    }
  })
})
