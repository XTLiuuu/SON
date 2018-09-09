/**
* This is the home page router 
*/
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'SON' });
});

module.exports = router;
