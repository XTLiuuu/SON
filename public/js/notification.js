console.log("loaded")
setInterval(
    function(){
        $.ajax({
          type: "POST",
          url: "/test.json", // return notification
          data: "good", // 
          success: function(data){
            console.log("data = " + JSON.stringify(data, null, 2))
          },
          dataType: "json",
        })
        console.log("Hello")}
  ,3000)
