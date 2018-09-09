app.get('/users/:id', isLoggedIn, usersController.getAllUsers );
app.post('/saveSetting', isLoggedIn, settingController.saveSetting);
app.get('/updateProfile', isLoggedIn, settingRouter, usersController.attachUser, profileController.attachProfile, profileController.getProfile1);
app.post('/saveProfile', isLoggedIn, profileController.checkSecret, profileController.saveProfile );

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

app.get('/test', helloDFController.getAllSchedule);
app.post('/deleteSchedule', helloDFController.deleteSchedule);
app.get('/hook', usersController.attachUser, helloDFController.getAllSchedule);
app.post('/hook', helloDFController.process_request);
app.get('/test_json', isLoggedIn, usersController.attachUser, notiController.generateNoti);
app.get('/countNoti', isLoggedIn, usersController.attachUser,notiController.countNoti)