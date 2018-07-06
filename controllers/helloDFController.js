'use strict';
const Schedule = require( '../models/Schedule' );
console.log("loading the schedule Controller")

exports.process_request =  (req, res, schedule) => {
  console.dir(req.body)
  console.log("in process_request")
  var output_string;
  var name;
  var schedule = new Map()

  // welcome and initialize list
  if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/0a65ec9a-eddd-47bb-b7d3-bec8204c1c58"){
    console.log("in Welcome");
    name = req.body.queryResult.parameters["given-name"]
    output_string = exports.welcome(name);
  }
  else if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/9deb94c8-c91c-4033-aec3-b753a4f59870"){
    console.log("in Add_Event");
    output_string = exports.addEvent(req.body.queryResult, schedule);
  }

  return res.json({
              "fulfillmentMessages": [],
              "fulfillmentText": output_string,
              "payload": {"slack":{"text": output_string}},
              "outputContexts": [],
              "source": "Text Source",
              "followupEventInput": {}
          });
};

exports.welcome = (name) => {
  console.log("in Welcome function")
  var response = "Hello, " + name + "." + " I'm your personal secretary, Pipi."
  return response;
};

exports.addEvent = (req, schedule) => {
  console.log("in addEvent")
  var text = req.queryText;
  var response;
  var time;
  var date;
  // user's input include time and date
  if(req.parameters["sysTime"] != null){
    time = req.parameters["sysTime"]; //how to get the date from time?  e.g. today, tomorrow
    date = req.parameters["date"];
    text = text.replace("Remind me to ", "")
    var end = text.indexOf(' at')
    if(end == -1) end = text.indexOf(' in') // e.g. in three minutes  Problem is locations using "in" too.
    text = text.slice(0, end)
    schedule.set(time, text);
    if(date == null){
      response = "Okay, I will remind you at " + time + " ."
    }
    else{
      response = "Okay, I will remind you on " + date + " at " + time + " ."
    }
  }
  let newSchedule = new Schedule ({
    count: 0,
    time: time,
    date: date,
    schedule: text
  })
  newSchedule.save()
  console.log("time is " + newSchedule.time);
  console.log("date is " + newSchedule.date);
  console.log("schedule is " + newSchedule.schedule);
  return response;
}
