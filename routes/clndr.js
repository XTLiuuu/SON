var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const tval =
  { title: 'SON',
    daysOfTheWeek:['M','T','W'],
    days:[{day:'7/13 Fri',classes:'bg-danger'},
          {day:'7/14 Sat',classes:'bg-info'}] }
  console.log(`tval=${JSON.stringify(tval)}`)
  res.render('clndr',tval);
});

module.exports = router;
