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
  console.log("in process_request")
  var result = {
    "fulfillmentMessages": [],
    "payload": {"slack":{"text":output_string}},
    "outputContexts": [],
    "source": "Text Source",
    "followupEventInput": {}
  };
  if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/9deb94c8-c91c-4033-aec3-b753a4f59870"){
    output_string = "hello dear"
    result.fulfillmentText = output_string;
    res.json(result);
  }
  else if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/9deb94c8-c91c-4033-aec3-b753a4f59870"){
    Profile.findOne({amazon: req.body.context.System.user["userId"]},
      function(err, profile){
        if(err){
          console.log(err.message)
        }
        else{
          if(profile == null){
            output_string = "Hi! Who are you? Please tell me your secret code."
          }
          else{
            userEmail = profile.email;
            name = profile.name;
            output_string = "Hi, " + name + ". What can I do for you?"
          }
          result.response.outputSpeech.text = output_string;
          res.json(result);
        }
      })
  }
}
