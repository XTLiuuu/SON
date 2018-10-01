'use strict';
const Schedule = require( '../models/Schedule' );
const Input = require( '../models/Input' );
const Friend = require( '../models/Friend' );
const Profile = require( '../models/Profile' );

var result1;
var name;
var userEmail;
var output_string = "Sorry, " + name + ". Can you say that again?";

exports.process_request =  (req, res) => {
  console.dir(req.body)
  var result = {
    "fulfillmentMessages": [],
    "payload": {"slack":{"text":output_string}},
    "outputContexts": [],
    "source": "Text Source",
    "followupEventInput": {}
  };
  // Add event key
  if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/9deb94c8-c91c-4033-aec3-b753a4f59870"){
    output_string = addEvent(req.body.queryResult);
    result.fulfillmentText = output_string;
    res.json(result);
  }
}

function addEvent(req){
  console.log("in add event")
  var date = req.parameters.date.slice(0, 10)
  var time = req.parameters.time.slice(11, 16)
  var text = req.parameters.quertText;
  console.log(text);
  var response;
  if(date == null){
    var today = new Date();
    if(today.getMonth().toString().length == 1){
      date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate();
    }
    else{
      date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
    response = "Okay, I will remind you at " + time + "."
  }
  else{
    response = "Okay, I will remind you on " + date + " at " + time + "."
  }
  //var start1 = date + " " + time + " "
  //var sd = date.toString.slice(0,10);
  let newInput = new Input ({
    email: "liuxuantong0611@gmail.com",
    title: "testshish",
    start: date + " " + time + " ",
    startDate: date,
    startTime: time,
    noti: "false",
  })
  newInput.save()
  return response;
}
