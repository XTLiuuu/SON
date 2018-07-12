'use strict';
const Schedule = require( '../models/Schedule' );
console.log("loading the schedule Controller")

exports.process_request =  (req, res) => {
  console.dir(req.body)
  console.log("in process_request")
  var output_string;
  var name;
 // this is how we define the result
  var result = {
    "version": "beta",

    "sessionAttributes":{
      "key":"value"
    },
    "response": {
      "outputSpeech": {
        "type": "PlainText",
        //"text": output_string
      },
      "reprompt": {
        "outputSpeech": {
          "type": "PlainText",
          "text": "Plain text string to speak reprompt"
        }
      },
      "shouldEndSession": true
    }
  };

  // some events not working
  // needs to figure out how to extract event
  // duration is not working
  if(req.body.request.intent.name == "add_event"){
    console.log("in Add_Event");
    output_string = addEvent(req.body.request);
    result.response.outputSpeech.text = output_string;
    res.json(result);
  }
  // include time and date
  else if(req.body.request.intent.name == "ask_event"){
    console.log("in Ask_Event1");
    var time = req.body.request.intent.slots.time["value"];
    var date = req.body.request.intent.slots.date["value"];
    Schedule.find({
      time: time,
      date: date,
    }, function(err, schedule_list){
      if(err){
        console.log( error.message );
      } else {
        if(schedule_list.length == 0){
          output_string = "You have nothing scheduled for " + date + " at " + time
        } else {
          console.log("schedule is " + schedule_list)
          if(schedule_list.length == 1){
            output_string =  time + " on " + date + " : "+ schedule_list[0].schedule;
          }
          else{
            output_string = time + " on " + date + " : "+ schedule_list[0].schedule;
            for(var i = 1; i < schedule_list.length; i ++){
              output_string = output_string + " , " + schedule_list[i].schedule;
            }
          }
        }
      }

      result.response.outputSpeech.text = output_string;
      res.json(result);
    })
  }

  else if(req.body.request.intent.name == "delete_event"){
    console.log("in delete_event");
    var time = req.body.request.intent.slots.time["value"];
    console.log("time = " + time)
    var date = req.body.request.intent.slots.date["value"];
    console.log("date = " + date)
    if(date == null){
      var today = new Date();
      date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
    var text = req.body.request.intent.slots.event["value"];
    console.log("text = " + text)
    Schedule.findOne({
      schedule: text,
      time: time,
      date: date,
    }, function(err, schedule){
      if(err){
        console.log( error.message );
      } else {
        if(schedule == null){
          output_string = text + " on " + date + " at " + time + " is not found"
        } else {
          console.log("schedule is " + schedule)
          output_string =  text + " on " + date + " at " + time + " is cancelled";
          Schedule.deleteOne({_id:schedule._id}).exec()
        }
      }

      result.response.outputSpeech.text = output_string;
      res.json(result);
    })
  }
};


function welcome(name) {
  console.log("in Welcome function")
  var response = "Hello, " + name + "." + " I'm your personal secretary, Pipi."
  return response;
};


function addEvent(req){
  console.log("in addEvent1")
  //var text = req.queryText;
  var response;
  var time = req.intent.slots.time["value"];
  console.log("time is " + time);
  var date = req.intent.slots.date["value"];
  console.log("date is " + date);
  var duration = req.intent.slots.duration["value"];
  console.log("duration is " + duration);
  var text = req.intent.slots.event["value"];
  console.log("event is " + text);
  // user's input include time and date
  if(time){
    console.log("add by time")
    if(date == null){
      var today = new Date();
      date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
    response = "Okay, I will remind you on " + date + " at " + time + " ."
  }
  if(duration){
    console.log("in duration")
    var end = text.indexOf('in')
    text = text.slice(0, end)
    var type = duration.slice(-1);
    var end1 = duration.indexOf('T');
    var num = duration.slice(end1 + 1, -1);
    if(type == "M"){
      if(num > 1){
        type = "minutes"
      }
      else{
        type = "minute"
      }
      var d = new Date();
      var now = new Date(d.getTime() + num*60000);
    }
    else if(type == "H"){
      if(num > 1){
        type = "hours"
      }
      else{
        type = "hour"
      }
      var d = new Date();
      var now = new Date(d.getTime() + num*60*60000);
    }
    else if(type == "D"){
      end1 = duration.indexOf('P');
      num = duration.slice(end1 + 1, -1);
      if(num > 1){
        type = "days"
      }
      else{
        type = "day"
      }
      var d = new Date();
      var now = new Date(d.getTime() + num*24*60*60000);
    }
    else if(type == "W"){
      end1 = duration.indexOf('P');
      num = duration.slice(end1 + 1, -1);
      if(num > 1){
        type = "weeks"
      }
      else{
        type = "week"
      }
      var d = new Date();
      var now = new Date(d.getTime() + num*7*24*60*60000);
    }
    var hour = now.getHours()
    var minute = now.getMinutes()
    if(minute.toString().length == 1){
      time = hour + ":0" + minute
    }
    else{
      time = hour + ":" + minute
    }
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    date = year + "-" + month + "-" + day;
    response = "Okay, I will remind you in " + num + " " + type
  }
  let newSchedule = new Schedule ({
    time: time,
    date: date,
    schedule: text,
    date1: date,
  })
  newSchedule.save()
  console.log("time is " + newSchedule.time);
  console.log("date is " + newSchedule.date);
  console.log("schedule is " + newSchedule.schedule);
  return response;
}

// this displays all of the skills
exports.getAllSchedule = ( req, res ) => {
  console.log('in getAllSchedule')
  Schedule.find( {} )
    .exec()
    .then( ( schedule ) => {
      res.render( 'test', {
        schedule: schedule
      } );
      console.log(schedule.length)
    })
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'getAllSchedule promise complete' );
    } );
};

exports.deleteSchedule = (req, res) => {
  console.log("in deleteSchedule")
  let schedule = req.body.deleteSchedule
  //check what schedule select to delete
  if (typeof(schedule)=='string') {
    console.log("in delete one")
    Schedule.deleteOne({_id:schedule})
         .exec()
         .then(()=>{res.redirect('/test')})
         .catch((error)=>{res.send(error)})
  } else if (typeof(schedule)=='object'){
      console.log("in delete many")
      Schedule.deleteMany({_id:{$in:schedule}})
           .exec()
           .then(()=>{res.redirect('/test')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(schedule)=='undefined'){
      console.log("This is if they didn't select an event")
      res.redirect('/test')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown event: ${schedule}`)
  }

};

function addByDuration(time, date, response){

}
