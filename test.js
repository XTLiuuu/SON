
exports.saveProfile = ( req, res ) => {
  console.log("in saveProfile!")

  if(!req.body.secret.trim()){
    res.status(400);
    res.json({message: "Please enter a keycode."})
    return;
  }

  Profile.findOne({secret: req.body.secret.toLowerCase().trim()}, function(err, result){
    if(err){
      res.status(err.status || 500);
      res.json(err);
      return;
    } else {
      if(result && result.email != req.user.googleemail){
        // keycode has been used
        res.status(400);
        res.json({message: "keycode has been used."});
        return;
      } else {
        //update keycode
        Profile.findOne({email: req.user.googleemail}, function(err, profile){
          console.log(profile)
          if(profile==null){
            console.log("in save!")
            let result = new Profile ({
              name: req.user.googlename,
              email: req.user.googleemail,
              phone: req.body.phone,
              gender: req.body.gender,
              dob: req.body.dob,
              about: req.body.about,
              secret: req.body.secret.toLowerCase().trim(),
              image: req.body.image,
              home: req.body.home
            })
            profile.save()
            res.redirect( '/setting' )
          } else {
              console.log("in update!")
              profile.update({email:res.locals.user.googleemail},
                {phone: req.body.phone,
                 gender: req.body.gender,
                 dob: req.body.dob,
                 about: req.body.about,
                 secret: req.body.secret.toLowerCase().trim(),
                 home: req.body.home,
                 image: req.body.image,
               })
                .exec()
                .then( () => {
                  res.redirect( '/setting' )
                } )
                .catch( error => {
                  res.send( error );
                });
              }
            })
          }
        }
      })
    }
