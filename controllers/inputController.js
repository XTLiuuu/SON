'use strict';
const Input = require( '../models/Input' );

exports.getAllInputs = ( req, res ) => {
  console.log('in getAllInput')
  Input.find( {} )
    .exec()
    .then( ( inputs ) => {
      res.render( 'addEvent', {
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

// attach the current users events
exports.attachInputs = ( req, res, next ) => {
  Input.find( {email:res.locals.user.googleemail} )
    .exec()
    .then( ( inputs ) => {
      res.locals.inputs = inputs
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

// save new event
exports.saveInput = ( req, res ) => {
  var sd = req.body.startDate;
  var start = sd.toString() + " " + req.body.startTime
  var ed = req.body.endDate;
  if(ed == "") ed = sd
  var end = ed.toString() + " " + req.body.endTime
  var allDay = false;
  if(req.body.allDay == 'on') allDay = true

  let newInput = new Input( {
    email: req.user.googleemail,
    title: req.body.title,
    allDay: allDay,
    start: start, // include both date and time
    end:end,
    startDate: sd.slice(0,10),
    startTime: req.body.startTime,
    endDate: ed.slice(0,10),
    endTime: req.body.endTime,
    editable: true,
    overlap: true,
    color: req.body.color,
    description: req.body.description,
    adCheck: req.body.allDay,
    noti: "false"
  } )
  newInput.save()
    .then( () => {
      res.redirect( '/calendar/calendarD' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

// delete events
exports.deleteInput = (req, res) => {
  let input = req.body.deleteInput
  console.log("in delete one")
  Input.deleteOne({_id:input})
   .exec()
   .then(() => {
     res.redirect('/add')
   })
   .catch((error) => {
     res.send(error)
   })
};
