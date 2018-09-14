// This is the setting page router
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('setting', { title: 'SON' });
});

module.exports = router;
 
