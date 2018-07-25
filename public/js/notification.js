console.log("loaded")
setInterval(
    function(){
        $.ajax({
          type: "POST",
          url: "/test.json", // return notification
          data: {
            test1: .val()
          }, //
          req.body.test1
          success: function(data){
            console.log("data = " + JSON.stringify(data, null, 2))
            $("check-result").text("success");
            setTimeout*)
          },
          dataType: "json",
        })
        console.log("Hello")}
  ,3000)
