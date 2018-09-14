'use strict';
const User = require( '../models/user' );
const mongo = require('mongodb');

// display all users on the user page when host login
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

// attach the current login user
exports.attachUser = ( req, res, next ) => {
  const objId = new mongo.ObjectId(req.params.id)
  User.findOne(objId)
    .exec()
    .then( ( user ) => {
      res.locals.user = req.user
      next()
    } )
    .catch( ( error ) => {
      console.log( error.message );
      return [];
    })
    .then( () => {
      console.log( 'attach user complete' );
    } );
};

// delete user when the host login
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
