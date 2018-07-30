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

countNoti()
setInterval(countNoti, 10000*100);
