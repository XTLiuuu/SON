function countNoti(){
    $.ajax({
      type: "GET",
      url: "/countNoti", // return notification
      success: function(data){
        console.log("success count")
        console.log(data)
        if(data > 0){
          $("#noti").text(data);
          // document.getElementById("noti").style.display = "block";
        }
      },
      dataType: "json",
    });
  }

function countMessage(){
    $.ajax({
      type: "GET",
      url: "/countMessage", // return notification
      success: function(data){
        console.log("success count message")
        console.log(data)
        if(data > 0){
          $("#message").text(data);
          // document.getElementById("noti").style.display = "block";
        }
      },
      dataType: "json",
    });
  }

countMessage()
setInterval(countMessage, 10000*100);
countNoti()
setInterval(countNoti, 10000*100);
