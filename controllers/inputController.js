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
  console.dir(req)
  let newInput = new Input( {
    email: req.user.googleemail,
    content: req.body.content
  } )

  //console.log("input = "+newinput)

  newInput.save()
    .then( () => {
      res.redirect( '/add' );
    } )
    .catch( error => {
      res.send( error );
    } );
};

exports.deleteInput = (req, res) => {
  console.log("in deleteInput")
  let inputName = req.body.deleteName
  if (typeof(inputName)=='string') {
      Input.deleteOne({content:inputName})
           .exec()
           .then(()=>{res.redirect('/newinput')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(inputName)=='object'){
      Input.deleteMany({content:{$in:inputName}})
           .exec()
           .then(()=>{res.redirect('/newinput')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(inputName)=='undefined'){
      console.log("This is if they didn't select a input")
      res.redirect('/add')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown inputName: ${inputName}`)
  }

};
