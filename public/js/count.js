function countNoti(){
    $.ajax({
      type: "GET",
      url: "/countNoti", // return notification
      success: function(data){
        console.log(data)
        $("#noti").text(data);
      },
      dataType: "json",
    });
  }

countNoti()
setInterval(countNoti, 10000);
