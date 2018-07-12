'use strict';
const Input = require( '../models/input' );
const mongo = require('mongodb');
console.log("loading the notification Controller")

// this displays all of the skills
exports.getAllInputs = ( req, res ) => {
  console.log('in getAllInput')
  Input.find( {} )
    .exec()
    .then( ( inputs ) => {
      res.render( 'notification', {
        inputs: inputs
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'get all notifications complete' );
    } );
};
