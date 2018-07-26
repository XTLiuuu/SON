// const Input = require('../models/Input');
// exports.findInput = (req, res, next) => {
//   Input.find({email:res.locals.user.googleemail})
//   .exec()
//   then((inputs) => {
//     res.locals.inputs = inputs
//     next()
//   })
//   .catch((error)=>{
//     console.log(error.message);
//     return [];
//   } )
//   .then( () =>{
//     console.log('find input promise complete');
//   })
// }
//db.inputs.find({ });

var d = new Date();
var dstring = d.toString();
var date = dstring.slice(0,10);
var time = dstring.slice(16,24);
console.log("date: "+dstring)
console.log("date: "+date)
console.log("time: "+time)
console.log("loaded")


setInterval(
    function(){
        $.ajax({
          type: "GET",
          url: "/test_json", // return notification
          success: function(data){
            console.log(data)
          },
          dataType: "json",
        })
      }, 300000);
