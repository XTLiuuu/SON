'use strict';
const Input = require( '../models/Input' );
console.log("loading the input Controller")


// this displays all of the skills
exports.getAllInputs = ( req, res ) => {
  console.log('in getAllInput')
  Input.find( {} )
    .exec()
    .then( ( inputs ) => {
      res.render( 'add', {
        inputs: inputs
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'content promise complete' );
    } );
};


exports.attachInputs = ( req, res, next ) => {
  console.log('in attachInputs')
  Input.find( {email:res.locals.user.googleemail} )
    .exec()
    .then( ( inputs ) => {
      res.locals.inputs = inputs
      console.dir(res.locals)
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'input promise complete' );
    } );
};


exports.saveInput = ( req, res ) => {
  console.log("in save input!")//after user save the input
  //console.dir(req)
  var sd = req.body.startDate;
  var sd1 = sd.toString();
<<<<<<< HEAD

  var st = req.body.startTime;
  var sd2 = sd.slice(0,10);
  var st = req.body.startTime

=======
  var st = req.body.startTime;
  var sd2 = sd.slice(0,10);
  var st = req.body.startTime
>>>>>>> 85392c94ce5ed4f25e78fe384ad7c6b99dc9a367
  var start = sd1 + " " + st + " "
  console.log("start = " + start)
  var ed = req.body.endDate;
  var ed1 = ed.toString();
  if(ed1 == ""){
    ed1 = sd1;
  }
  var ed2 = ed.slice(0,10);
  var et = req.body.endTime
  var end = ed1 + " " + et
  console.log("end = " + end)
  var ad = req.body.allDay
  var allDay;
  if(ad == 'on'){
    allDay = true;
  }
  else{
    allDay = false;
  }
  let newInput = new Input( {
    email: req.user.googleemail,
    id: req.body.id,
    title: req.body.title,
    allDay: allDay,
    start: start,
    end:end,
    startDate: sd2,
    startTime: req.body.startTime,
    endDate: ed2,
    endTime: req.body.endTime,
    url:req.body.url,
    editable: true,
    overlap: true,
    color: req.body.color,
<<<<<<< HEAD

    description: req.body.description,
    adCheck: req.body.allDay

=======
    description: req.body.description,
    adCheck: req.body.allDay
>>>>>>> 85392c94ce5ed4f25e78fe384ad7c6b99dc9a367
  } )


  newInput.save()
    .then( () => {
      res.redirect( '/calendar/calendarD' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deleteInput = (req, res) => {
  console.log("in deleteInput")
  let input = req.body.deleteInput
  if (typeof(input)=='string') {
    console.log("in delete one")
    Input.deleteOne({_id:input})
         .exec()
         .then(()=>{res.redirect('/add')})
         .catch((error)=>{res.send(error)})
  } else if(typeof(input)=='object'){
    console.log("in delete many")
    Input.deleteMany({_id:{$in:input}})
         .exec()
         .then(()=>{res.redirect('/add')})
         .catch((error)=>{res.send(error)})
  } else if (typeof(inputName)=='undefined'){
      console.log("This is if they didn't select a input")
      res.redirect('/add')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown inputName: ${inputName}`)
  }

};
