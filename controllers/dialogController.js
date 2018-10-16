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
     addEvent(req, res)
    }
   else if(req.body.result.metadata.intentId == "9fb21409-2c68-4193-8bfc-71c4a7d1493a"){
     ask_friend_number(req, res)
   }
   else if(req.body.result.metadata.intentId == "2bcdf3b2-370c-4314-b1bc-4e86523d78c8"){
     guess_free(req, res);
   }
   else if(req.body.result.metadata.intentId == "9e1f26b9-139c-4995-9c30-ce1b57d92936"){
     check_in_friend(req, res);
   }
   else if(req.body.result.metadata.intentId == "492d8e5f-49e0-4477-adea-125322660c83"){
     ask_friend_avail(req, res);
   }
   else if(req.body.result.metadata.intentId == "d4489da3-80c8-4692-ad9d-4530e2cda7e8"){
     ask_event(req, res)
   }
   else if(req.body.result.metadata.intentId == "8f9d3377-bcf3-4526-8539-e04708146aa7"){
     delete_event(req, res)
   }
   else if(req.body.result.metadata.intentId == "b2bcfa8d-f579-42f1-83ae-ad6982ec3fda"){
     change_name(req, res)
   }
}


function addEvent(req, res){
  console.log("in add event")
   var title = req.body.result.parameters.name;
   var time = req.body.result.parameters.time;
   var recurence = req.body.result.parameters.recurence;
   var date = "";
   var sessionID = req.body.sessionId;
   console.log(sessionID)
   console.dir(req.body)
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
   if(title == null){
     output_string = "What is the name of your reminder, Pipi?"
   }
   if(time == null){
     output_string = "When do you want me to remind you Pipi?"
   }
   else{
     output_string = "Okay, Pipi, I will remind you to " + title + " on " + date + " at " + time;
   }
   Input.findOne({sessionID:sessionID},
     function(err, input){
       if(err){
         console.log("there is an error")
       }
       else{
         console.log("input: " + input)
         if(input == null){
           let newInput = new Input ({
              email: userEmail,
              title: title,
              start: date + " " + time,
              startDate: date,
              startTime: time,
              recurence: recurence,
              noti: "false",
              sessionID: sessionID
            })
            newInput.save();
         }
         else{
           const startDate =  date || input.startDate
           const startTime =  time || input.startTime
           input.update({sessionID:sessionID},
             {email: userEmail,
             title: title || input.title,
             startDate: startDate,
             startTime: startTime,
             start: startDate + " " + startTime,
             recurence: recurence || input.recurrence,
             noti: "false",
             sessionID: sessionID
           }).exec()
         }
       }
       console.log(result)
       console.log(res)
       result.speech = output_string;
       res.json(result);
     }
   );
}

function change_name(req, res){
  var oldName = req.body.result.parameters.oldName
  var newName = req.body.result.parameters.name
  Input.findOne({
    email: userEmail,
    title: oldName
  }, function(err, input){
    if(err){
    } else{
      if(input == null){
        output_string = oldName + " is not found."
      }
      else{
        Input.update({_id: input._id},{
          title: newName,
        }).exec()
        output_string = oldName + " has been changed to " + newName
      }
    }
    result.speech = output_string;
    res.json(result);
  })
}

function delete_event(req, res){
  var time = req.body.result.parameters.time
  var date = req.body.result.parameters.date
  if(date == null){
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    date = year+'-'+month+'-'+day;
  }
  var text = req.body.result.parameters.name
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
        output_string = text + " on " + date + " at " + time + " is not found"
      } else {
        output_string =  text + " is cancelled"
        Input.deleteOne({_id:input._id}).exec()
      }
    }
    result.speech = output_string;
    res.json(result);
  })
}
function ask_event(req, res){
  console.log("ask event")
  result1 = [];
  var time = req.body.result.parameters.time;
  var date = req.body.result.parameters.date
  if(date == null){
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    date = year+'-'+month+'-'+day;
  }
  var constraint = req.body.result.parameters.constraint
  // if the user does not include time - e.g. What am I going to do before three p.m.
  // the default time is today
  if(constraint){
    console.log("here1")
    ask_event_withConstraint(req, res, time, date, constraint, time1)
  }

  // when the user asks a certain time slot
  else if(time){
    console.log("here2")
    ask_event_withTime(req, res, date, time)
  }

  // when the user asks a certain date
  // e.g. what am i going to do tomorrow
  else{
    console.log("here3")
    ask_event_withDate(req, res, date)
  }
}

function ask_event_withDate(req, res, date){
  console.log("here4")
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
    result.speech = output_string;
    res.json(result);
  })
}

function ask_event_withConstraint(req, res, time, date, constraint){
  console.log("here5")
  var time1;
  if(time == null){
    var s = new Date(date);
    time1 = "notime"
  }
  else{
    var s = new Date(date);
    s.setDate(s.getDate() + 1);
    var index = time.indexOf(":")
    s.setHours(time.slice(0, index), time.slice(index + 1, index + 3));
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
      result.speech = output_string;
      res.json(result);
    })
  }
}


function ask_event_withTime(req, res, date, time){
  console.log("here6")
  var s = new Date(date);
  s.setDate(s.getDate() + 1);
  var index = time.indexOf(":")
  s.setHours(time.slice(0, index), time.slice(index + 1, index + 3));
  Input.find({
    email: userEmail,
    start: s
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
    result.speech = output_string;
    res.json(result);
  })
}

function ask_friend_avail(req, res) {
  console.log("in ask friend avail")
  var inputsentence = req.body.result.resolvedQuery.trim();
  var indexIS = inputsentence.indexOf(" ");
  var indexFREE = inputsentence.indexOf("free");
  var friendName = inputsentence.substring(indexIS + 1, indexFREE - 1);
  var time = req.body.result.parameters.time;
  var date = req.body.result.parameters.date
  friendName = friendName.trim();
  var index = friendName.indexOf(" ")
  friendName = friendName.charAt(0).toUpperCase() + friendName.slice(1, index + 1) + friendName.charAt(index + 1).toUpperCase() + friendName.slice(index + 2, friendName.length)
  if(date == null){
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    date = year+'-'+month+'-'+day;
  }
  var s = new Date(date);
  s.setDate(s.getDate() + 1);
  index = time.indexOf(":")
  s.setHours(time.slice(0, index), time.slice(index + 1, index + 3));
  console.log(s)
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
             result.speech = output_string;
             res.json(result);
           }
         });
       }
     }
   })
}


function check_in_friend(req, res){
    var inputsentence = req.body.result.resolvedQuery.trim();
    var indexIS = inputsentence.indexOf(" ");
    var indexIN = inputsentence.indexOf("in");
    var friendName = inputsentence.substring(indexIS + 1, indexIN - 1);
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
       result.speech = output_string;
       res.json(result);
     })
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
  console.log("id: " + req.body.sessionId)
  Profile.findOne({dialogflow: req.body.sessionId},
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
            profile.dialogflow = req.body.sessionId;
            profile.save();
          }
          output_string = "Hi, " + name + ". What can I do for you?"
        }
        result.speech = output_string;
        res.json(result);
      }
    })
}
