var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require( 'mongoose' );
const clndr = require( './routes/clndr' );
var moment = require('moment');

var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var addRouter = require('./routes/add');
var welcomeRouter = require('./routes/welcome');
var calendarYRouter = require('./routes/calendarY');
var calendarMRouter = require('./routes/calendarM');
var calendarWRouter = require('./routes/calendarW');
var calendarDRouter = require('./routes/calendarD');
var settingRouter = require('./routes/setting');
var notificationRouter = require('./routes/notification');
var app = express();

const usersController = require('./controllers/usersController')
const inputController = require('./controllers/inputController');
const profileController = require('./controllers/profileController');
const helloDFController = require('./controllers/helloDFController');
<<<<<<< HEAD
const notiController = require('./controllers/notiController');
=======
const calendarController = require( './controllers/calendarController' );
const friendController = require('./controllers/friendController');
>>>>>>> 1fe239ca602a8e739dec386a5f15679b26c0c1a0
const User = require( './models/user' )

//friend function
const friend = require('./routes/friend')
const addfriend = require('./routes/addfriend')

const session = require("express-session")
const bodyParser = require("body-parser");
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)

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
app.use('/calendarM', isLoggedIn, calendarMRouter);
app.use('/calendarW', isLoggedIn, calendarWRouter);
app.use('/calendarD', isLoggedIn, calendarDRouter);
app.use('/calendarY', isLoggedIn, calendarYRouter);

app.get('/users', isLoggedIn, usersController.getAllUsers );
app.get('/users/:id', isLoggedIn, usersController.getAllUsers );

//app.use('/setting', settingRouter);

app.get('/setting', isLoggedIn, settingRouter, usersController.attachUser, profileController.attachProfile, profileController.getProfile);
app.post('/saveProfile', isLoggedIn, profileController.saveProfile );

app.use('/add', isLoggedIn, usersController.attachUser, inputController.attachInputs, usersController.getUser);
app.use('/saveinput',isLoggedIn, inputController.saveInput);


app.get('/calendar', calendarController.getCalendar);

// friend function
app.use('/friend',friend)
app.use('/addfriend', isLoggedIn, addfriend);
app.post('/searchProfile', isLoggedIn, friendController.searchProfile);



app.use('/notification', isLoggedIn, usersController.attachUser,inputController.attachInputs, usersController.getUser,notificationRouter);
//app.use('/notification', isLoggedIn, notiController.attachNoti, notiController.getAllNotis);

app.get('/test', helloDFController.getAllSchedule);
app.post('/deleteSchedule', helloDFController.deleteSchedule);
app.get('/hook', helloDFController.getAllSchedule);
app.post('/hook', helloDFController.process_request);

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
