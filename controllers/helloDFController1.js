'use strict';
const Schedule = require( '../models/Schedule' );
const Input = require( '../models/Input' );
const Friend = require( '../models/Friend' );
console.log("loading the hello1 Controller")
var name = "Pipi"

exports.process_request =  (req, res) => {
  console.dir(req.body)
  console.log("in process_request")
  var output_string = "Sorry, " + name + ". Can you say that again?";

  // welcome and initialize list
  if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/0a65ec9a-eddd-47bb-b7d3-bec8204c1c58"){
    console.log("in Welcome");
    name = req.body.queryResult.parameters["given-name"]
    output_string = welcome(name);
  }

  // add schedule
  else if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/9deb94c8-c91c-4033-aec3-b753a4f59870"){
    console.log("in Add_Event");
    output_string = addEvent(req.body.queryResult);
  }

  else if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/d4489da3-80c8-4692-ad9d-4530e2cda7e8"){
    console.log("in Broadcast_Event");
    var time = req.body.queryResult.parameters["time"]
    output_string = bcEvent(time);
  }

  // delete event
  else if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/88f75d90-304f-4311-bffa-507fc91d82ac"){
    console.log("in Delete_Event");
    var text = req.body.queryResult.queryText;
    console.log("1")
    var time = req.body.queryResult.parameters["sysTime"];
    console.log("1")
    var date = req.body.queryResult.parameters["date"];
    console.log("1")
    text = text.replace("Delete ", "")
    console.log("1")
    var end = text.indexOf(' at')
    if(end == -1){
      end = text.indexOf(' in')
    }
    console.log("1")
    text = text.slice(0, end)
    end = text.indexOf('tomorrow')
    text = text.slice(0, end)
    end = text.indexOf(' next')
    text = text.slice(0, end)
    end = text.indexOf(' on')
    text = text.slice(0, end)
    time = time.slice(11, 16)
    date = date.slice(0, 10)
    console.log("1")
    console.log("time = " + time)
    console.log('date = ' + date)
    console.log("text = [" + text+"]")

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
  var time = req.parameters["sysTime"];
  var date = req.parameters["date"];
  text = text.replace("Remind me to ", "")
  var end = text.indexOf(' at')
  if(end == -1){
    end = text.indexOf(' in')
  }
  text = text.slice(0, end)
  end = text.indexOf('tomorrow')
  text = text.slice(0, end)
  end = text.indexOf(' next')
  text = text.slice(0, end)
  end = text.indexOf(' on')
  text = text.slice(0, end)
  time = time.slice(11, 16)
  date = date.slice(0, 10)
  console.log("time = " + time)
  console.log('date = ' + date)
  console.log("text = [" + text+"]")
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
    response = "Okay, " + name + ", I will remind you on " + date + " at " + time + "."
  }
  var start1 = date + " " + time + " "
  var sd = date.toString().slice(0,10);
  let newInput = new Input ({
    email: "liuxuantong0611@gmail.com",
    title: text.trim(),
    start: start1,
    startDate: sd,
    startTime: time
  })
  newInput.save()
  console.log(newInput);
  console.log(response)
  return response;
}

function bcEvent(time){
  var response;
  for(var i = 0; i < data.length; i ++){
    if(data[i].time == time){
      response = "You will " + data[i].schedule + " at " + time;
    }
  }
  if(response == null){
    response = "There is no schedule at " + time
  }
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
