var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require( 'mongoose' );
var moment = require('moment');

var homeRouter = require('./routes/home');
const settingRouter = require('./routes/setting');
const calendarD = require('./routes/calendarD')
var app = express();

const usersController = require('./controllers/usersController')
const inputController = require('./controllers/inputController');
const profileController = require('./controllers/profileController');
const dialogController1 = require('./controllers/dialogController1');
const dialogController = require('./controllers/dialogController');
const alexaController = require('./controllers/alexaController');
const notiController = require('./controllers/notiController');
const fullcalenController = require('./controllers/fullcalenController')
const friendController = require('./controllers/friendController');
const settingController = require('./controllers/settingController');

const User = require( './models/user' )

const session = require("express-session")
const bodyParser = require("body-parser");
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)

// here is where we connect to the database!
const mongoDB = process.env.MONGO_URI || 'mongodb://localhost:27017/SON';
mongoose.connect(mongoDB, {useNewUrlParser: true});
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
 console.log("we are connected!")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'zzbbyanana',
  resave: true,
  saveUninitialized: false
 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(3000, function(){
  console.log('API server listening...');
})

// The following changes are made for dialogflow
app.use((req,res,next) => {
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    res.locals.user = req.user
    res.locals.loggedIn = true
    if (req.user){
      if (req.user.googleemail=='lxt@brandeis.edu'){
        res.locals.status = '0211'
      } else {
        res.locals.status = 'user'
      }
    }
  }
  next()
})

//Now add the authentication routes
app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/login/authorized',passport.authenticate('google', {
    successRedirect : '/',
    failureRedirect : '/loginerror'
}));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
      return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/auth/google');
}

// the home page route
app.use('/', homeRouter);
app.get('/users', isLoggedIn, usersController.getAllUsers );
app.get('/users/:id', isLoggedIn, usersController.getAllUsers );
app.post('/deleteUser', isLoggedIn, usersController.deleteUser);
app.get('/setting', isLoggedIn, settingRouter, usersController.attachUser, profileController.attachProfile, settingController.attachSetting,
  profileController.attachProfile, settingController.getSetting);
app.post('/saveSetting', isLoggedIn, settingController.saveSetting);
app.get('/updateProfile', isLoggedIn, settingRouter, usersController.attachUser, profileController.attachProfile, profileController.getProfile);
app.post('/saveProfile', isLoggedIn, profileController.checkSecret, profileController.saveProfile );
app.get('/add', isLoggedIn, usersController.attachUser, inputController.attachInputs, inputController.getAllInputs);
app.post('/saveinput',isLoggedIn, inputController.saveInput);
app.post('/deleteinput',isLoggedIn, inputController.deleteInput);
app.use('/calendar', calendarD);
app.use('/interact_history/:friend_id', isLoggedIn, notiController.interact_history);
app.get('/friend',isLoggedIn, profileController.attachProfile, friendController.getFriend, friendController.getFriendProfile);
app.get('/searchPage',isLoggedIn, friendController.searchPage);
app.post('/check_avail',isLoggedIn, friendController.check_avail);
app.post('/guess_free',isLoggedIn, friendController.attachFriend, friendController.guess_free);
app.post('/searchProfile', isLoggedIn, friendController.searchProfile_post);
app.get('/searchProfile',isLoggedIn, friendController.searchProfile_get)
app.post('/sendFrequest',isLoggedIn, profileController.attachProfile, friendController.sendFrequest);
app.get('/notification', isLoggedIn, usersController.attachUser,notiController.getAllNotis);
app.post('/notification', isLoggedIn, profileController.attachProfile, notiController.updateRequest);
app.post('/hook', dialogController.process_request);
//app.post('/hook', dialogController1.dialogflowFirebaseFulfillment);
app.get('/test_json', isLoggedIn, usersController.attachUser, notiController.generateNoti);
app.get('/countNoti', isLoggedIn, usersController.attachUser,notiController.countNoti)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
