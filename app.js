var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require( 'mongoose' );
var moment = require('moment');
var HashSet = require('hashset');



var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var addRouter = require('./routes/add');
var welcomeRouter = require('./routes/welcome');
var calendarDRouter = require('./routes/calendarD');
var settingRouter = require('./routes/setting');
var notificationRouter = require('./routes/notification');
var app = express();

const usersController = require('./controllers/usersController')
const inputController = require('./controllers/inputController');
const profileController = require('./controllers/profileController');
const helloDFController = require('./controllers/helloDFController');
const helloDFController1 = require('./controllers/helloDFController1');
const notiController = require('./controllers/notiController');
const calendarController = require( './controllers/calendarController' );
const fullcalenController = require('./controllers/fullcalenController')
const friendController = require('./controllers/friendController');
const settingController = require('./controllers/settingController');
const User = require( './models/user' )

//friend function
const friend = require('./routes/friend')
const addfriend = require('./routes/addfriend')

const session = require("express-session")
const bodyParser = require("body-parser");
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)

//routes
const calendarD = require('./routes/calendarD');

// here is where we connect to the database!
mongoose.connect( 'mongodb://localhost:27017/SON', {useNewUrlParser: true});
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

// The following changes are made for dialogflow

var server = app.listen(3000, function(){
  console.log('API server listening...');
})

app.use((req,res,next) => {
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    console.log("user has been Authenticated")
    res.locals.user = req.user
    res.locals.loggedIn = true
    if (req.user){
      if (req.user.googleemail=='lxt@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = '0211'
      } else {
        console.log('User has logged in')
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
// app.get('/login', function(req,res){
//   res.render('login',{})
//     })
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
//app.use('/login', loginRouter);
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
}));
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      return next();
    }
    console.log("user has not been authenticated...")
    // if they aren't redirect them to the home page
    res.redirect('/auth/google');
}

console.log("before the users routes...")
console.dir(usersController)

app.use('/', welcomeRouter);

app.get('/users', isLoggedIn, usersController.getAllUsers );
app.get('/users/:id', isLoggedIn, usersController.getAllUsers );
app.post('/deleteUser', isLoggedIn, usersController.deleteUser);

//app.use('/setting', settingRouter);
app.get('/setting', isLoggedIn, settingRouter, usersController.attachUser,
                    profileController.attachProfile,settingController.attachSetting,
                    settingController.getSetting,profileController.getProfile);
app.post('/saveSetting', isLoggedIn, settingController.saveSetting);
//app.get('/setting', isLoggedIn, settingRouter, usersController.attachUser, profileController.attachProfile, settingController.attachSetting, profileController.getProfile);
app.get('/updateProfile', isLoggedIn, settingRouter, usersController.attachUser, profileController.attachProfile, profileController.getProfile1);
app.post('/saveProfile', isLoggedIn, profileController.checkSecret, profileController.saveProfile );
//app.get('saveSetting', isLoggedIn,)

app.use('/add', isLoggedIn, usersController.attachUser, inputController.attachInputs, usersController.getUser);
app.use('/saveinput',isLoggedIn, inputController.saveInput);
app.use('/deleteinput',isLoggedIn, inputController.deleteInput);

app.use('/calendar', calendarD);

// friend function
app.get('/friend',isLoggedIn, friendController.getFriend, friendController.getFriendProfile);
app.get('/friend1',isLoggedIn, friendController.getFriend1);
app.post('/check_avail',isLoggedIn, friendController.check_avail);
app.post('/guess_free',isLoggedIn, friendController.attachFriend, friendController.guess_free);

app.post('/searchProfile', isLoggedIn, friendController.searchProfile_post);
app.get('/searchProfile',isLoggedIn, friendController.searchProfile_get)
app.post('/sendFrequest',isLoggedIn, profileController.attachProfile, friendController.sendFrequest);

app.get('/notification', isLoggedIn, usersController.attachUser,notiController.attachNoti,notiController.getAllNotis);
app.post('/notification', isLoggedIn, profileController.attachProfile, friendController.updateRequest);
//app.use('/notification', isLoggedIn,usersController.attachUser, notiController.attachNoti, notiController.getAllNotis);
//app.post('/acceptRequest', isLoggedIn, friendController.acceptRequest);

app.post('/check_secret', profileController.check_secret);
app.get('/test', helloDFController.getAllSchedule);
app.post('/deleteSchedule', helloDFController.deleteSchedule);
app.get('/hook', usersController.attachUser, helloDFController.getAllSchedule);
app.post('/hook', helloDFController.process_request);


app.get('/test_json', isLoggedIn, usersController.attachUser, function(req, res){
  const current_date = new Date();
  const current_date_start = new Date(current_date.toISOString().substring(0, current_date.toISOString().indexOf("T")));
  console.dir(current_date_start)
  const Input = require('./models/Input.js');
  const User = require('./models/user.js')
  Input.find({
    start: {$gte: current_date_start},
    email: req.user.googleemail
  }).exec().then((input_list)=> {
    console.log("in test_json again")
    console.dir(input_list)
    res.json(input_list);
  }).catch((err) => {
    console.log("in test_json err")
    res.status(err.status || 500);
    res.json(err);
  })

})



app.get('/countNoti', isLoggedIn, usersController.attachUser, function(req, res){
  console.log("in count noti 1")
  const Notification = require('./models/Notification.js')
  console.log("here")
  console.log(req.user.googleemail)
  Notification.find({
    to: req.user.googleemail
  }).exec().then((noti_list)=> {
    console.log(noti_list)
    console.log("count notification here")
    console.log("noti number" + noti_list.length)
    res.json(noti_list.length);
  }).catch((err) => {
    console.log("in count notification err")
    res.status(err.status || 500);
    res.json(err);
  })
})


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
