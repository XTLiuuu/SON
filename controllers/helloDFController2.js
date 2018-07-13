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

  // needs to figure out how to extract event
  if(req.body.request.intent.name == "add_event"){
    console.log("in Add_Event");
    output_string = addEvent(req.body.request);
    console.log("output_string1 = " + output_string)
    result.response.outputSpeech.text = output_string;
    res.json(result);
  }

  // ask what event will happen at some time
  else if(req.body.request.intent.name == "ask_event"){
    console.log("in Ask_Event1");
    var time = req.body.request.intent.slots.time["value"];
    var date = req.body.request.intent.slots.date["value"];
    var constraint = req.body.request.intent.slots.constraint["value"];
    // if the user does not include time - e.g. What am I going to do before three p.m.
    // the default time is today
    if(date == null){
      var today = new Date();
      date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }

    // when the user asks a certain time slot
    if(time){
      Schedule.find({
        time: time,
        date: date,
      }, function(err, schedule_list){
        if(err){
          console.log( error.message );
        } else {
          // if the schedule_list is empty
          if(schedule_list.length == 0){
            output_string = "You have nothing scheduled for " + date + " at " + time
          } else {
            // if the list contains only one event
            if(schedule_list.length == 1){
              output_string =  time + " on " + date + " : "+ schedule_list[0].schedule;
            }
            // if the list contains more than one event
            // do this only for format
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

    // when the user asks a certain date
    // e.g. what am i going to do tomorrow
    else{
      Schedule.find({
        date: date,
      }, function(err, schedule_list){
        if(err){
          console.log( error.message );
        } else {
          if(schedule_list.length == 0){
            output_string = "You have nothing scheduled for " + date
          } else {
            console.log("schedule is " + schedule_list)
            if(schedule_list.length == 1){
              output_string = date + " : "+ schedule_list[0].schedule;
            }
            else{
              output_string = date + " : "+ schedule_list[0].schedule;
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
  }

  // delete event
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
    var text = req.body.request.intent.slots.eventText["value"];
    if(text.slice(-2) == "at"){
      text = text.slice(0, -2)
    }
    console.log("text = " + text)
    console.log("["+text.trim()+"]");
    console.log(text.length);

    Schedule.findOne({
      schedule: text.trim(),
      date: date,
      time: time
    }, function(err, schedule){
      if(err){
        console.log( error.message );
      } else {
        console.log("schedule is " + schedule)
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


// dialogflow
function welcome(name) {
  console.log("in Welcome function")
  var response = "Hello, " + name + "." + " I'm your personal secretary, Pipi."
  return response;
};

// save event
function addEvent(req){
  console.log("in addEvent1")
  var response;
  var time = req.intent.slots.time["value"];
  console.log("time = " + time)
  var date = req.intent.slots.date["value"];
  console.log("date = " + date)
  var duration = req.intent.slots.duration["value"];
  console.log("duration = " + duration)
  var text = req.intent.slots.eventText["value"];
  console.log("text =" + text)
  if(time){
    console.log("add by time")
    if(date == null){
      var today = new Date();
      if(today.getMonth().toString().length == 1){
        console.log("here1")
        date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate();
      }
      else{
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      }
    }
    response = "Okay, I will remind you on " + date + " at " + time + "."
  }

  if(duration){
    console.log("in duration")
    if(text.slice(-2) == 'in'){
      text = text.slice(0, -2)
    }
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
    if(minute.toString().length == 1 && hour.toString().length == 1){
      time = "0" + hour + ":0" + minute
    }
    else if(minute.toString().length == 1){
      time = hour + ":0" + minute
    }
    else if(hour.toString().length == 1){
      time = "0" + hour + ":" + minute
    }
    else{
      time = hour + ":" + minute
    }
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    if(month.toString().length == 1 && day.toString().length == 1){
      date = year + "-0" + month + "-0" + day;
    }
    else if(month.toString().length == 1){
      date = year + "-0" + month + "-" + day;
    }
    else if(hour.toString().length == 1){
      date = year + "-" + month + "-0" + day;
    }
    else{
      date = year + "-" + month + "-" + day;
    }
    response = "Okay, I will remind you in " + num + " " + type
  }
  if(text.slice(-2) == "at"){
    text = text.slice(0, -2)
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
  console.log(response)
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
