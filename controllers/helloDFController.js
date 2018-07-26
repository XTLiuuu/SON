'use strict';
const Schedule = require( '../models/Schedule' );
const Input = require( '../models/Input' );
console.log("loading the ipnut Controller")
var result1;
var name = "Pipi";

exports.process_request =  (req, res) => {
  console.dir(req.body)
  console.log("in process_request")
  //console.log("user = " + req.locals.user)
  //console.log("req.user.goo = " + req.locals.user)
  var output_string = "Sorry, " + name + ". Can you say that again?";
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




  if(req.body.request.intent.name == "tell_name"){
    console.log("in tell name")
    name = req.body.request.intent.slots.name["value"];
    output_string = "Hi, " + name + ". I'm your personal secretary, Pipi. What can I do for you?"
    result.response.outputSpeech.text = output_string;
    res.json(result);
   }



  // needs to figure out how to extract event
  else if(req.body.request.intent.name == "add_event"){
    console.log("in Add_Event");
    output_string = addEvent(req.body.request, req.user);
    console.log("output_string1 = " + output_string)
    result.response.outputSpeech.text = output_string;
    res.json(result);
  }




  // ask what event will happen at some time
  else if(req.body.request.intent.name == "ask_event"){
    result1 = [];
    console.log("in Ask_Event1");
    var time = req.body.request.intent.slots.time["value"];
    var date = req.body.request.intent.slots.date["value"];
    var constraint = req.body.request.intent.slots.constraint["value"];
    console.log("constraint = " + constraint)
    // if the user does not include time - e.g. What am I going to do before three p.m.
    // the default time is today
    if(date == null){
      var today = new Date();
      date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    }
    console.log("date = " + date)
    console.log("time = " + time)
    if(constraint){
      if(time == null){
        var s = new Date(date);
      }
      else{
        var s = new Date(date);
        s.setDate(s.getDate()+1)
        var index = time.indexOf(":")
        s.setHours(time.slice(0, index), time.slice(index + 1, time.length));
      }
      console.log("s = " + s)
      if(constraint == "before"){
        Input.find({email: "liuxuantong0611@gmail.com",},
        function(err, schedule_list){
          if(err){
            console.log(err.message);
          } else{
            console.log("after finding results")
            console.log("list length = " + schedule_list.length)
            for(var i = 0; i < schedule_list.length; i ++){
              console.log("i = " + i)
              console.log("list start " + schedule_list[i].start)
              var today = new Date();
              if(schedule_list[i].start <= s && schedule_list[i].start >= today){
                result1.push(schedule_list[i]);
              }
              console.log("result = " + result1)
            }
            console.log("length= " + result1.length)
            if(result1.length == 0){
              output_string = name + ", you have nothing scheduled before " + time + " on " + date
            }
            else{
              console.log("here")
              console.log(result1[0].title)
              console.log(result1[0].startTime)
              console.log(result1[0].startDate)
              output_string = name + ": "+ result1[0].title + " at " + result1[0].startTime + " on " + result1[0].startDate + "; "
              for(var i = 1; i < result1.length; i ++){
                output_string = output_string + result1[i].title + " at " + result1[i].startTime + " on " + result1[i].startDate + "; ";
              }
            }
          }
          console.log("output_string1 = " + output_string)
          result.response.outputSpeech.text = output_string;
          res.json(result);
        })
      }
    }

    // when the user asks a certain time slot
    else if(time){
      var start1 = date + " " + time
      Input.find({
        email: "liuxuantong0611@gmail.com",
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
      console.log("in no time")
      Input.find({
        email: "liuxuantong0611@gmail.com",
        startDate: date,
      }, function(err, schedule_list){
        if(err){
          console.log( error.message );
        } else {
          console.log("after finding in no time")
          if(schedule_list.length == 0){
            output_string = name + ", you have nothing scheduled for " + date
          } else {
            console.log("schedule is " + schedule_list)
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
        console.log(output_string)
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
    if(text.slice(-2) == "on"){
      text = text.slice(0, -2)
    }
    console.log("text = " + text)
    console.log("["+text.trim()+"]");
    var start1 = date + " " + time
    Input.findOne({
      email: "liuxuantong0611@gmail.com",
      title: text.trim(),
      start: start1
    }, function(err, input){
      if(err){
        console.log( err.message );
      } else {
        console.log("Input is " + input)
        if(input == null){
          output_string = text + " on " + date + " at " + time + " is not found, " + name
        } else {
          console.log("Input is " + input)
          output_string =  text + " on " + date + " at " + time + " is cancelled, " + name;
          Input.deleteOne({_id:input._id}).exec()
        }
      }

      result.response.outputSpeech.text = output_string;
      res.json(result);
    })
  }




  else if(req.body.request.intent.name == "update_event"){
    var update_event = req.body.request.intent.slots;
    console.log("in update event")
    var prevText = update_event.prevText["value"]
    console.log("prevText = " + prevText)
    if(prevText.slice(-2) == "at"){
      prevText = prevText.slice(0, -2)
    }
    if(prevText.slice(-2) == "on"){
      prevText = prevText.slice(0, -2)
    }
    console.log("prevText1 = " + prevText)
    var prevTime = update_event.prevTime["value"]
    console.log("prevTime = " + prevTime)
    var prevDate = update_event.prevDate["value"]
    console.log("prevDate = " + prevDate)
    var newText = update_event.newText["value"]
    console.log("newText = " + newText)
    if(newText != null && newText.slice(-2) == "at"){
      newText = newText.slice(0, -2)
    }
    if(newText != null && newText.slice(-2) == "on"){
      newText = newText.slice(0, -2)
    }
    console.log("newText1 = " + newText)
    var newTime = update_event.newTime["value"]
    console.log("newTime = " + newTime)
    var newDate = update_event.newDate["value"]
    console.log("newDate = " + newDate)
    if(prevDate == null){
      var today = new Date();
      prevDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      console.log("prevDate1 = " + prevDate)
    }
    if(newDate == null){
      newDate = prevDate;
      console.log("newDate1 = " + newDate)
    }
    if(newTime == null){
      newTime = prevTime;
      console.log("newTime1 = " + newTime)
    }
    if(newText == null){
      newText = prevText;
      console.log("newText1= " + newText)
    }
    var start1 = prevDate + " " + prevTime
    console.log("start1 = " + start1)
    var s = new Date(prevDate);
    s.setDate(s.getDate() + 1)
    var index = prevTime.indexOf(":")
    s.setHours(prevTime.slice(0, index), prevTime.slice(index + 1, prevTime.length));
    console.log("s = " + s)
    var start2 = newDate + " " + newTime
    console.log("start2 = " + start2)
    var sd = newDate.toString().slice(0,10);
    console.log("sd = " + sd)
    console.log("[" + prevText.trim() + "]")
    Input.findOne({
      email: "liuxuantong0611@gmail.com",
      title: prevText.trim(),
      start: s,
    }, function(err, input){
      console.log("found11")
      if(err){
        console.log(err.message);
      } else{
        console.log("found 22")
        console.dir(input)
        console.log(input)
        if(input == null){
          console.log("input is empty")
          output_string = prevText + " on " + prevDate + " at " + prevTime + " is not found, " + name + ". "
        }
        else{
          console.log("Input1 " + input);
          Input.update({_id: input._id},{
            title: newText.trim(),
            start: start2,
            startDate: sd,
            startTime: newTime,
          }).exec()
          output_string = name + ", " + prevText + " at " + prevTime + " on " + prevDate + " has been changed to " + newText + " at " + newTime + " on " + newDate;
        }
      }
      console.log(output_string)
      result.response.outputSpeech.text = output_string;
      res.json(result);
    })
  }



  else{
    console.log("in no intent")
    result.response.outputSpeech.text = name + ", what are you talking about?"
    res.json(result);
  }
};


// save event
function addEvent(req, user){
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
    response = "Okay, " + name + ", I will remind you on " + date + " at " + time + "."
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
    response = "Okay, pipi, I will remind you in " + num + " " + type
  }
  if(text.slice(-2) == "at"){
    text = text.slice(0, -2)
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

// this displays all of the skills
exports.getAllSchedule = ( req, res ) => {
  console.log('in getAllSchedule')
  Input.find( {email: "liuxuantong0611@gmail.com",} )
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
