
app.get('/notification', isLoggedIn, usersController.attachUser,notiController.attachNoti,notiController.getAllNotis);
app.post('/notification', isLoggedIn, profileController.attachProfile, friendController.updateRequest);

app.get('/test', helloDFController.getAllSchedule);
app.post('/deleteSchedule', helloDFController.deleteSchedule);
app.get('/hook', usersController.attachUser, helloDFController.getAllSchedule);
app.post('/hook', helloDFController.process_request);
app.get('/test_json', isLoggedIn, usersController.attachUser, notiController.generateNoti);
app.get('/countNoti', isLoggedIn, usersController.attachUser,notiController.countNoti)
