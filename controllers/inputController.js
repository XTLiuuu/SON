'use strict';
const input = require( '../models/Input' );
console.log("loading the input Controller")


// this displays all of the skills
exports.getAllInput = ( req, res ) => {
  console.log('in getAllInput')
  Input.find( {} )
    .exec()
    .then( ( input ) => {
      res.render( 'add', {
        input: input
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

exports.attachInput = ( req, res, next ) => {
  console.log('in attachInput')
  Input.find( {} )
    .exec()
    .then( ( input ) => {
      res.locals.input = input
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
    content: req.body.content
  } )

  //console.log("input = "+newinput)

  newInput.save()
    .then( () => {
      res.redirect( '/newinput' );
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
