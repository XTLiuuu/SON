'use strict';
const Schedule = require( '../models/Schedule' );
const Input = require( '../models/Input' );
const Friend = require( '../models/Friend' );
const Profile = require( '../models/Profile' );
const WebhookClient = require('dialogflow-fulfillment')

var result1;
var name;
var userEmail;
var output_string = "Sorry, " + name + ". Can you say that again?";

exports.process_request =  (req, res) => {
  console.dir(req.body)
  const agent = new WebhookClient({ req, res });
  console.log("agent")
  console.log(agent);
  // var result = {
  //   "fulfillmentMessages": [],
  //   "payload": {"slack":{"text":output_string}},
  //   "outputContexts": [],
  //   "source": "Text Source",
  //   "followupEventInput": {}
  // };

  if(req.body.result.metadata.intentId == "bfdfafa6-9302-412b-9e6b-5b3d8a966735"){
    output_string = addEvent(req.body.result.parameters);
    console.log(output_string);
    // result.speech = output_string;
    // res.json(result);
    agent.add(output_string);
  }
}

function addEvent(req){
   console.log("in add event")
   var title = req.name;
   var time = req.time;
   var recurence = req.recurence;
   var date = "";
   var response;
   if(name == null){
     return "Give your reminder a name";
   }
   if(time == null){
     return "What time";
   }
   if(time.charAt(2) == ':'){
     var today = new Date();
      if(today.getMonth().toString().length == 1){
        date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate();
      }
      else{
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      }
   }
   else{
     date = time.substring(0, 10);
     time = time.substring(11, 19);
   }
   response = "Okay, I will remind you to " + title + " on " + date + " at " + time;
   let newInput = new Input ({
      email: "liuxuantong0611@gmail.com",
      title: title,
      start: date + " " + time,
      startDate: date,
      startTime: time,
      recurence: recurence,
      noti: "false",
    })
    newInput.save()
    return response;
}
