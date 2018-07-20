'use strict';
const User = require( '../models/user' );
const mongo = require('mongodb');
console.log("loading the users Controller")


// this displays all of the skills
exports.getAllUsers = ( req, res ) => {
  console.log('in getAllUsers')
  User.find( {} )
    .exec()
    .then( ( users ) => {
      res.render( 'users', {
        users: users
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'getUsers promise complete' );
    } );
};

exports.getUser = ( req, res ) => {
  const objId = new mongo.ObjectId(req.params.id)
  User.findOne(objId) //{"_id": objId})
    .exec()
    .then( ( user ) => {
      res.render( 'add', {
        user: user
      } );
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log( 'getUser promise complete' );
    } );
};

exports.attachUser = ( req, res, next ) => {
  console.log('in attachUser')
  const objId = new mongo.ObjectId(req.params.id)
  User.findOne(objId) //{"_id": objId})
    .exec()
    .then( ( user ) => {
      res.locals.user = req.user
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    } )
    .then( () => {
      console.log(res.locals.user.googleemail);
      console.log( 'attachUser promise complete' );
    } );
};


exports.deleteUser = (req, res) => {
  console.log("in deleteUser")
  let userName = req.body.deleteName
  //check what users select to delete
  if (typeof(userName)=='string') {
      User.deleteOne({_id:userName})
           .exec()
           .then(()=>{res.redirect('/users')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(userName)=='object'){
      User.deleteMany({_id:{$in:userName}})
           .exec()
           .then(()=>{res.redirect('/users')})
           .catch((error)=>{res.send(error)})
  } else if (typeof(userName)=='undefined'){
      console.log("This is if they didn't select a user")
      res.redirect('/users')
  } else {
    console.log("This shouldn't happen!")
    res.send(`unknown userName: ${userName}`)
  }

};
