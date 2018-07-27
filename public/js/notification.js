function getNotifications(){
    $.ajax({
      type: "GET",
      url: "/test_json", // return notification
      success: function(data){
        console.log(JSON.stringify(data,null,4))
        for(let i=0; i<data.length; i++){
          const d = new Date(data[i].start)
          const n = new Date()
          const dn = (d-n)
          const title = data[i].title
          if ((dn<1000*60*5) && (dn>0)) {
            alert("You have a notification: "+title+" at "+data[i].startTime)
            console.log('alerting! ')
          } else {
            console.log("hmmm d-n = "+(d-n))
          }
        }
      },
      dataType: "json",
    });
  }

getNotifications()

setInterval(getNotifications, 60*1000*2);
