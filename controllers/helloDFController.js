'use strict';
const Schedule = require( '../models/Schedule' );
console.log("loading the schedule Controller")

exports.process_request =  (req, res) => {
  console.dir(req.body)
  console.log("in process_request")
  var output_string;
  var name;

  // welcome and initialize list
  if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/0a65ec9a-eddd-47bb-b7d3-bec8204c1c58"){
    console.log("in Welcome");
    name = req.body.queryResult.parameters["given-name"]
    output_string = welcome(name);
    var count = 0;
  }

  // add schedule
  else if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/9deb94c8-c91c-4033-aec3-b753a4f59870"){
    console.log("in Add_Event");
    output_string = addEvent(req.body.queryResult);
  }

  // broadcast all schedules
  // e.g. What do I need to do before three p.m.?
  /**
  else if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/d4489da3-80c8-4692-ad9d-4530e2cda7e8"){
    console.log("in Broadcast_Event");
    var time = req.body.queryResult.parameters["time"]
    Schedule.findOne({time:time})
  //Profile.findOne(objId) //{"_id": objId})
    .exec()
    .then( ( schedule ) => {
      res.locals.profile = profile
      next()
  }
  */

  // delete event
  else if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/88f75d90-304f-4311-bffa-507fc91d82ac"){
    console.log("in Delete_Event");
    output_string = exports.deleteEvent(req.body.queryResult);
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



function welcome(name) {
  console.log("in Welcome function")
  var response = "Hello, " + name + "." + " I'm your personal secretary, Pipi."
  return response;
};


function addEvent(req){
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
  console.log("name is " + newSchedule.name);
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

// this displays all of the skills
exports.getSchedules = ( req, res, next ) => {
  console.log('in getSchedules')
  Schedule.find( {} )
    .exec()
    .then( ( schedule ) => {
        schedule = schedule
        next()
    })
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'getSchedules promise complete' );
    } );
};

// this displays all of the skills
function getCurrSchedule(res, time) {
    console.log('in getCurrSchedule')
    var response;
    var result = res.locals.schedule.find({time:time});
    console.log(result.length);
    for(var s in result){
      //console.log("current schedule is "+ s.count);
      var curr = "ID: " + s.count + ", Time: " + s.time + ", Date: " + s.date + ", Event: " + s.schedule
      response = curr;
    }
    return response;
};

exports.deleteEvent = (req) => {
  console.log("in deleteEvent")
  var text = req.queryText;
  var response;
  var time;
  if(req.parameters["sysTime"] != null){
    text = text.replace("Delete ", "")
    time = req.parameters["sysTime"];
    var end = text.indexOf(' at')
    if(end == -1) end = text.indexOf(' in') // e.g. in three minutes  Problem is locations using "in" too.
    text = text.slice(0, end)
  }
  console.log(text);
  Schedule.deleteOne({schedule:text});
  response = text + " cancalled";
  return response;
};


exports.deleteSchedule = (req, res) => {
  console.log("in deleteSchedule")
  let schedule = req.body.deleteSchedule
  //check what schedule select to delete
  if (typeof(schedule)=='string') {
    console.log("in delete one")
    Schedule.deleteOne({schedule:schedule})
         .exec()
         .then(()=>{res.redirect('/test')})
         .catch((error)=>{res.send(error)})
  } else if (typeof(schedule)=='object'){
      console.log("in delete many")
      Schedule.deleteMany({schedule:{$in:schedule}})
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
