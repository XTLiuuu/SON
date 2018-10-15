'use strict';
const Schedule = require( '../models/Schedule' );
const Input = require( '../models/Input' );
const Friend = require( '../models/Friend' );
const Profile = require( '../models/Profile' );
console.log("in dialogflow")

var result1;
var name;
var userEmail = "liuxuantong0611@gmail.com";
var output_string = "Sorry, " + name + ". Can you say that again?";
var result;

exports.process_request =  (req, res) => {
   result = {
     "fulfillmentMessages": [],
     "payload": {"slack":{"text":output_string}},
     "outputContexts": [],
     "source": "Text Source",
     "followupEventInput": {}
   };
   if(req.body.result.metadata.intentId == "ec10e4c0-4d48-4b90-9091-0203dfb5fb7e"){
     open_chat(req, res);
   }
   else if(name == undefined && req.body.result.metadata.intentId != "eab207b8-853d-4def-8377-4fb15551a0ab"){
     unknow_user(req, res);
   }
   else if(req.body.result.metadata.intentId == "eab207b8-853d-4def-8377-4fb15551a0ab"){
     check_secret(req, res);
   }
   else if(req.body.result.metadata.intentId == "bfdfafa6-9302-412b-9e6b-5b3d8a966735"){
      output_string = addEvent(req.body.result.parameters);
      result.speech = output_string;
      res.json(result);
    }
   else if(req.body.result.metadata.intentId == "9fb21409-2c68-4193-8bfc-71c4a7d1493a"){
     ask_friend_number(req, res)
   }
   else if(req.body.result.metadata.intentId == "2bcdf3b2-370c-4314-b1bc-4e86523d78c8"){
     guess_free(req, res);
   }
}

function guess_free(req, res){
  console.log("in guess_free")
  var time = req.body.result.parameters.time;
  var date = req.body.result.parameters.date
  if(date == null){
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    date = year+'-'+month+'-'+day;
  }
  console.log(date)
  console.log(time)
  var s = new Date(date);
  s.setDate(s.getDate() + 1);
  var index = time.indexOf(":")
  s.setHours(time.slice(0, index), time.slice(index + 1, index + 3));
  console.log(s)
  var freeFriend = [];
  Friend.find({user: userEmail},
   function(err, friend_list){
     if(err){
       console.log(err.message)
       res.status(err.status || 500);
       res.json(err);
     } else{
       var x = 0;
       checkWithFriend(friend_list, s, freeFriend, x, function(err, freeResult){
         if(err){
           console.log(err.message)
           res.status(err.status || 500);
           res.json(err);
         } else {
           var free = "";
           for(var a = 0; a < freeResult.length; a ++){
             free = free + freeResult[a] + ", "
           }
           free = free.slice(0, free.length-2)
           if(freeResult.length == 0){
             output_string = "I'm sorry, " + name + ". You don't have any friends available on " + date + " at " + time
           }
           else{
             if(date){
               output_string = "Free friends on " + date + " at " + time + ": " + free;
             }
             else{
               output_string = "Free friends at " + time + ": " + free;
             }
           }
           result.speech = output_string;
           res.json(result);
         }
       });
     }
   })
}

function checkWithFriend(friend_list, s, freeFriend, x, callback){
  var length = friend_list.length
  Input.find({email: friend_list[x]["friend"]},
    function(err, input_list){
      if(err){
        callback(err, null);
      } else{
        var checkStatus;
        for(var i = 0; i < input_list.length; i ++){
          if(input_list[i].endTime != ""){
            if(input_list[i].start.getTime() <= s.getTime() && s.getTime() <= input_list[i].end.getTime()){
              checkStatus = "BUSY";
            }
          }
          else{
            if(input_list[i].start.getTime() == s.getTime()){
              checkStatus = "BUSY";
            }
          }
        }
        if(x == friend_list.length - 1 && checkStatus == "BUSY"){
          callback(null, freeFriend);
        }
        if(checkStatus != "BUSY"){
          freeFriend.push(friend_list[x].friendname);
          if(x == friend_list.length - 1){
            callback(null, freeFriend);

          }
          if(x < friend_list.length - 1){
            checkWithFriend(friend_list, s, freeFriend, x + 1, callback)
          }
        }
        else{
          if(x < friend_list.length - 1){
            checkWithFriend(friend_list, s, freeFriend, x + 1, callback)
          }
        }
      }
    }
  )
}


function ask_friend_number(req, res){
  console.log("in ask_friend_number")
  Friend.find({user: userEmail},
   function(err, friend_list){
     if(err){
       console.log(err.message)
       res.status(err.status || 500);
       res.json(err);
     } else{
       var num = friend_list.length;
       var names = "";
       if(num == 1){
         names = friend_list[0].friendname;
       }
       if(num == 0){
         output_string = "Oh! You have no friend in SON. Please add some friends."
       }
       if(num == 1){
         output_string = "You have only one friend. The name is " + names
       }
       else{
         output_string = name + ", you currently have " + num + " friends."
       }
     }
     result.speech = output_string;
     res.json(result);
   })
}


function unknow_user(req, res){
  Profile.findOne({dialogflow: req.body.id},
    function(err, profile){
      if(err){
        console.log(err.message)
      }
      else{
        if(profile == null){
          output_string = "Hi! Who are you? Please tell me your secret code."
        }
        result.speech = output_string;
        res.json(result);
      }
    })
}


function open_chat(req, res){
  console.log("id: " + req.body.id)
  Profile.findOne({dialogflow: req.body.id},
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
        result.speech = output_string;
        res.json(result);
      }
    })
}


function check_secret(req, res){
  var inputsentence = req.body.result.resolvedQuery.trim();
  var index = inputsentence.indexOf("is");
  var secret = inputsentence.substring(index + 3);
  Profile.findOne({secret: secret},
    function(err, profile){
      if(err){
        console.log(err.message)
      }
      else{
        if(profile == null){
          output_string = "Sorry, " + secret + " is not a correct secret code"
        }
        else{
          userEmail = profile.email;
          if(name == null){
            name = profile.name;
            profile.dialogflow = req.body.id;
            profile.save();
          }
          output_string = "Hi, " + name + ". What can I do for you?"
        }
        result.speech = output_string;
        res.json(result);
      }
    })
}


function addEvent(req){
   var title = req.name;
   var time = req.time;
   var recurence = req.recurence;
   var date = "";
   var response;
   if(time.charAt(2) == ':' && recurence == null){
     var today = new Date();
     var year = today.getFullYear();
     var month = today.getMonth() + 1;
     var day = today.getDate();
     if(month < 10 && day < 10){
        date = year+'-0'+month+'-0'+day;
     }
     else if(month >= 10 && day < 10){
        date = year+'-'+month+'-0'+day;
     }
     else if(month < 10 && day >= 10){
        date = year+'-0'+month+'-'+day;
     }
     else{
        date = year+'-'+month+'-'+day;
     }
   }
   else{
     date = time.substring(0, 10);
     time = time.substring(11, 19);
   }
   response = "Okay, Pipi, I will remind you to " + title + " on " + date + " at " + time;
   let newInput = new Input ({
      email: userEmail,
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
