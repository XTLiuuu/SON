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
  // console.dir(req.body)
  console.log("in process_request")
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
  if(req.body.request.intent.name == "open_skill"){
    Profile.findOne({amazon: req.body.context.System.user["userId"]},
      function(err, profile){
        console.log("after finding profile")
        if(err){
          console.log(err.message)
        }
        else{
          console.log("after finding profile")
          console.log(profile)
          if(profile == null){
            output_string = "Hi! Who are you? Please tell me your secret code."
          }
          else{
            userEmail = profile.email;
            name = profile.name;
            console.log(userEmail)
            console.log(name)
            console.log("user6 = " + userEmail)
            output_string = "Hi, " + name + ". What can I do for you?"
          }
          result.response.outputSpeech.text = output_string;
          res.json(result);
        }
      })
  }
  else if(name == undefined && req.body.request.intent.name != "ask_secret"){
    Profile.findOne({amazon: req.body.context.System.user["userId"]},
      function(err, profile){
        if(err){
          console.log(err.message)
        }
        else{
          if(profile == null){
            output_string = "Hi! Who are you? Please tell me your secret code."
          }
          result.response.outputSpeech.text = output_string;
          res.json(result);
        }
      })
  }

  else if(req.body.request.intent.name == "ask_secret"){
    var secret = req.body.request.intent.slots.secret["value"];
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
              profile.amazon = req.body.context.System.user["userId"];
              profile.save();
            }
            output_string = "Hi, I know you are" + name + ". What can I do for you?"
          }
          result.response.outputSpeech.text = output_string;
          res.json(result);
        }
      })
   }

   else if(req.body.request.intent.name == "ask_friend_number"){
     console.log("in ask_friend_number")
     console.log(userEmail)
     Friend.find({user: userEmail},
      function(err, friend_list){
        if(err){
          console.log(err.message)
          res.status(err.status || 500);
          res.json(err);
        } else{
          var num = friend_list.length;
          var names = "";
          if(num != 0){
            names = friend_list[0].friendname;
          }
          for(var x = 1; x < num; x ++){
            names = names + ", " + friend_list[x].friendname;
          }
          if(num == 0){
            output_string = "Oh! You have no friend in SON. Please add more friends, and have fun with me."
          }
          if(num == 1){
            output_string = "You have only one friend. The name is " + names
          }
          else{
            output_string = name + ", you currently have " + num + " friends. Their names are " + names
          }
        }
        result.response.outputSpeech.text = output_string;
        res.json(result);
      })
   }

   else if(req.body.request.intent.name == "guess_free"){
     var time = req.body.request.intent.slots.time["value"];
     var date = req.body.request.intent.slots.date["value"];
     var freeFriend = [];
     var s = new Date(date);
     s.setDate(s.getDate() + 1);
     var index = time.indexOf(":")
     s.setHours(time.slice(0, index), time.slice(index + 1, time.length));
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
              result.response.outputSpeech.text = output_string;
              res.json(result);
            }
          });
        }
      })
   }


   else if(req.body.request.intent.name == "check_inFriend"){
     var friendName =  req.body.request.intent.slots.name["value"];
     friendName = friendName.trim();
     var index = friendName.indexOf(" ")
     friendName = friendName.charAt(0).toUpperCase() + friendName.slice(1, index + 1) + friendName.charAt(index + 1).toUpperCase() + friendName.slice(index + 2, friendName.length)
     Friend.findOne({
       user: userEmail,
       friendname: friendName
     },
      function(err, friend){
        if(err){
          console.log(err.message)
        } else{
          if(friend == null){
            output_string = "I'm sorry. " + friendName + " is not your friend."
          }
          else{
            output_string = "Yes! " + friendName + " is in your friend list."
          }
        }
        result.response.outputSpeech.text = output_string;
        res.json(result);
      })
   }

   else if(req.body.request.intent.name == "ask_friend_avail"){
     var friendName =  req.body.request.intent.slots.name["value"];
     var date =  req.body.request.intent.slots.date["value"];
     var time =  req.body.request.intent.slots.time["value"];
     friendName = friendName.trim();
     var index = friendName.indexOf(" ")
     friendName = friendName.charAt(0).toUpperCase() + friendName.slice(1, index + 1) + friendName.charAt(index + 1).toUpperCase() + friendName.slice(index + 2, friendName.length)
     var s = new Date(date);
     s.setDate(s.getDate()+1)
     var index1 = time.indexOf(":")
     s.setHours(time.slice(0, index1), time.slice(index1 + 1, time.length));
     Friend.findOne({friendname: friendName},
       function(err, friend){
         if(err){
           console.log(err.message)
         }
         else{
           if(friend == null){
             output_string = "I'm sorry. " + friendName + " is not your friend."
             result.response.outputSpeech.text = output_string;
             res.json(result);
           }
           else{
             var friendEmail = friend["friend"]
             checkFriendStatus(friendName, friendEmail, s, date, time, function(err, output_string){
               if(err){
                 console.log(err.message)
                 res.status(err.status || 500);
                 res.json(err);
               } else {
                 result.response.outputSpeech.text = output_string;
                 res.json(result);
               }
             });
           }
         }
       })
   }

  // needs to figure out how to extract event
  else if(req.body.request.intent.name == "add_event"){
    output_string = addEvent(req.body.request, req.user);
    result.response.outputSpeech.text = output_string;
    res.json(result);
  }

  // ask what event will happen at some time
  else if(req.body.request.intent.name == "ask_event"){
    result1 = [];
    var time = req.body.request.intent.slots.time["value"];
    var date = req.body.request.intent.slots.date["value"];
    var constraint = req.body.request.intent.slots.constraint["value"];
    // if the user does not include time - e.g. What am I going to do before three p.m.
    // the default time is today
    if(date == null){
      var today = new Date();
      date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
    var time1;
    if(constraint){
      if(time == null){
        var s = new Date(date);
        time1 = "notime"
      }
      else{
        var s = new Date(date);
        s.setDate(s.getDate()+1)
        var index = time.indexOf(":")
        s.setHours(time.slice(0, index), time.slice(index + 1, time.length));
      }
      if(constraint == "before"){
        Input.find({email: userEmail,},
        function(err, schedule_list){
          if(err){
            console.log(err.message);
          } else{
            for(var i = 0; i < schedule_list.length; i ++){
              var today = new Date();
              if(schedule_list[i].start <= s && schedule_list[i].start >= today){
                result1.push(schedule_list[i]);
              }
            }
            if(result1.length == 0){
              if(time1 == "notime"){
                output_string = name + ", you have nothing scheduled before " + date
              }
              else{
                output_string = name + ", you have nothing scheduled before " + time + " on " + date
              }
            }
            else{
              if(time1 == "notime"){
                output_string = "Before " + date + " ," + name + ": "+ result1[0].title + " at " + result1[0].startTime + " on " + result1[0].startDate + "; "
                for(var i = 1; i < result1.length; i ++){
                  output_string = output_string + result1[i].title + " at " + result1[i].startTime + " on " + result1[i].startDate + "; ";
                }
              }
              else{
                output_string = "Before " + date + " ," + time + " ," + name + ": "+ result1[0].title + " at " + result1[0].startTime + " on " + result1[0].startDate + "; "
                for(var i = 1; i < result1.length; i ++){
                  output_string = output_string + result1[i].title + " at " + result1[i].startTime + " on " + result1[i].startDate + "; ";
                }
              }
            }
          }
          result.response.outputSpeech.text = output_string;
          res.json(result);
        })
      }
    }

    // when the user asks a certain time slot
    else if(time){
      var start1 = date + " " + time
      Input.find({
        email: userEmail,
        start: start1
      }, function(err, schedule_list){
        if(err){
          console.log( error.message );
        } else {
          // if the schedule_list is empty
          if(schedule_list.length == 0){
            output_string = name + ", you have nothing scheduled for " + date + " at " + time
          } else {
            // if the list contains only one event
            if(schedule_list.length == 1){
              output_string =  time + " on " + date + ", " + name + ": "+ schedule_list[0].title + "; ";
            }
            // if the list contains more than one event
            // do this only for format
            else{
              output_string = time + " on " + date + ", " + name + ": "+ schedule_list[0].title + "; ";
              for(var i = 1; i < schedule_list.length; i ++){
                output_string = output_string + schedule_list[i].title + "; ";
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
      Input.find({
        email: userEmail,
        startDate: date,
      }, function(err, schedule_list){
        if(err){
        } else {
          if(schedule_list.length == 0){
            output_string = name + ", you have nothing scheduled for " + date
          } else {
            if(schedule_list.length == 1){
              output_string = date + ", " + name + ": "+ schedule_list[0].title + " at " + schedule_list[0].startTime + "; ";
            }
            else{
              output_string = date + ", " + name + ": "+ schedule_list[0].title + " at " + schedule_list[0].startTime + "; ";
              for(var i = 1; i < schedule_list.length; i ++){
                output_string = output_string + schedule_list[i].title + " at " + schedule_list[i].startTime + "; ";
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
    var time = req.body.request.intent.slots.time["value"];
    var date = req.body.request.intent.slots.date["value"];
    if(date == null){
      var today = new Date();
      date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
    var text = req.body.request.intent.slots.eventText["value"];
    if(text.slice(-2) == "at"){
      text = text.slice(0, -2)
    }
    if(text.slice(-2) == "on"){
      text = text.slice(0, -2)
    }
    var start1 = date + " " + time
    Input.findOne({
      email: userEmail,
      title: text.trim(),
      start: start1
    }, function(err, input){
      if(err){
        console.log( err.message );
      } else {
        if(input == null){
          output_string = text + " on " + date + " at " + time + " is not found, "
        } else {
          output_string =  text + " on " + date + " at " + time + " is cancelled";
          Input.deleteOne({_id:input._id}).exec()
        }
      }
      result.response.outputSpeech.text = output_string;
      res.json(result);
    })
  }

  else if(req.body.request.intent.name == "update_event"){
    var update_event = req.body.request.intent.slots;
    var prevText = update_event.prevText["value"]
    if(prevText.slice(-2) == "at"){
      prevText = prevText.slice(0, -2)
    }
    if(prevText.slice(-2) == "on"){
      prevText = prevText.slice(0, -2)
    }
    var prevTime = update_event.prevTime["value"]
    var prevDate = update_event.prevDate["value"]
    var newTime = update_event.newTime["value"]
    var newDate = update_event.newDate["value"]
    if(prevDate == null){
      var today = new Date();
      prevDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
    if(newDate == null){
      newDate = prevDate;
    }
    if(newTime == null){
      newTime = prevTime;
    }
    var start1 = prevDate + " " + prevTime
    var s = new Date(prevDate);
    s.setDate(s.getDate() + 1)
    var index = prevTime.indexOf(":")
    s.setHours(prevTime.slice(0, index), prevTime.slice(index + 1, prevTime.length));
    var start2 = newDate + " " + newTime
    var sd = newDate.toString().slice(0,10);
    Input.findOne({
      email: userEmail,
      title: prevText.trim(),
      start: s,
    }, function(err, input){
      if(err){
      } else{
        if(input == null){
          output_string = prevText + " on " + prevDate + " at " + prevTime + " is not found."
        }
        else{
          Input.update({_id: input._id},{
            title: prevText.trim(),
            start: start2,
            startDate: sd,
            startTime: newTime,
          }).exec()
          output_string = name + ", " + prevText + " on " + prevDate + " on " + prevTime + " has been changed to " + newDate + " at " + newTime;
        }
      }
      result.response.outputSpeech.text = output_string;
      res.json(result);
    })
  }



  else{
    result.response.outputSpeech.text = "Sorry, " + name + ", I cannot understand what you said. Can you rephrase it?"
    res.json(result);
  }
};


// save event
function addEvent(req, user){
  var response;
  var time = req.intent.slots.time["value"];
  var date = req.intent.slots.date["value"];
  var duration = req.intent.slots.duration["value"];
  var text = req.intent.slots.eventText["value"];
  if(time){
    if(date == null){
      var today = new Date();
      if(today.getMonth().toString().length == 1){
        date = today.getFullYear()+'-0'+(today.getMonth()+1)+'-'+today.getDate();
      }
      else{
        date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      }
    }
    response = "Okay, " + name + ", I will remind you on " + date + " at " + time + "."
  }

  if(duration){
    if(text.slice(-2) == 'in'){
      text = text.slice(0, -2)
    }
    var type = duration.slice(-1);
    var end1 = duration.indexOf('T');
    var num = duration.slice(end1 + 1, -1);
    if(type == "M"){
      type = "minute"
      if(num > 1) type = "minutes"
      var d = new Date();
      var now = new Date(d.getTime() + num*60000);
    }
    else if(type == "H"){
      type = "hour"
      if(num > 1) type = "hours"
      var d = new Date();
      var now = new Date(d.getTime() + num*60*60000);
    }
    else if(type == "D"){
      end1 = duration.indexOf('P');
      num = duration.slice(end1 + 1, -1);
      type = "day"
      if(num > 1) type = "days"
      var d = new Date();
      var now = new Date(d.getTime() + num*24*60*60000);
    }
    else if(type == "W"){
      end1 = duration.indexOf('P');
      num = duration.slice(end1 + 1, -1);
      type = "week"
      if(num > 1) type = "weeks"
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
    response = "Okay," + name + ", I will remind you in " + num + " " + type
  }
  if(text.slice(-2) == "at"){
    text = text.slice(0, -2)
  }
  var start1 = date + " " + time + " "
  var sd = date.toString().slice(0,10);
  let newInput = new Input ({
    email: userEmail,
    title: text.trim(),
    start: start1,
    startDate: sd,
    startTime: time,
    noti: "false",
  })
  newInput.save()
  return response;
}

function checkFriendStatus(friendName, friendEmail, s, date, time, callback){
  Input.find({email: friendEmail},
    function(err, input_list){
      if(err){
        console.log(err.message);
        callback(err, null);
      }
      else{
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
        if(checkStatus != "BUSY"){
          checkStatus = "FREE"
        }
        var response
        if(date){
          response = friendName + " is " + checkStatus + " on " + date + " at " + time
        }
        else{
          response = friendName + " is " + checkStatus + " at " + time
        }
        callback(null, response);
      }
    }
  )
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
