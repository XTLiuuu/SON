
exports.check_secret = (req, res, next) =>{
  console.log("in check_secret1")
  console.log(req.body.keycode);
  if(!req.body.keycode.trim()){
    res.status(400);
    res.json({message: "Please enter a keycode."})
  }

  Profile.findOne({secret: req.body.keycode.trim()}, function(err, result){
    if(err){
      res.status(err.status || 500);
      res.json(err);
    } else {
      if(result){
        console.log("find secret")
        // keycode has been used
        res.status(400);
        res.json({message: "The keycode has been used. Please try a new one"});
      } else {
        //update keycode
        res.locals.secret = req.body.keycode.trim();
      }
      next()
    }
  })
}
