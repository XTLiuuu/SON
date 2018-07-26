//var openInbox = document.getElementById("myBtn");
//openInbox.click();

$(document).ready(function(){
  $("input.check-avail-submit").on('click', function(event){
    event.preventDefault();
    console.dir(event)
    const fid = event.currentTarget.attributes["fid"].nodeValue
    console.log("clicked!")
    const theData = {
      friendName: $("#friendName"+fid).val(),
      friendEmail: $("#friendEmail"+fid).val(),
      checkDate: $("#checkDate"+fid).val(),
      checkTime: $("#checkTime"+fid).val()
    }
    console.dir(theData)
    $.ajax({
      type: "POST",
      url:"/check_avail",
      data: theData,
      success: function(data){
        console.log("inside success")
        var name = data["friendName"]
        var date = data["checkDate"]
        var time = data["checkTime"]
        var status = data["checkStatus"]
        $("#check-result").text(name + " is " + status + " on " + date + " at " + time + "!");
        console.log("data is")
        console.dir(data)
        console.dir(document.getElementById("check-result"));
        document.getElementById("check-result").style.display = "block";
        document.getElementById(fid+"modal").style.display = "none";
        setTimeout(function(){document.getElementById("check-result").style.display = "none"}, 3000)
      },
      dataType: "json",
    })
  })
})

$(document).ready(function(){
  $("input.guess-free").on('click', function(event){
    event.preventDefault();
    console.dir(event)
    console.log("gues-free clicked!")
    const theData = {
      currUser: $("#currUser").val(),
      currUserID: $("currUserID").val(),
      checkDate: $("#checkDate").val(),
      checkTime: $("#checkTime").val()
    }
    console.dir(theData)
    $.ajax({
      type: "POST",
      url:"/guess_free",
      data: theData,
      success: function(data){
        console.log("guess success")
        var freeFriend = data["freeFriend"]
        var date = data["checkDate"]
        var time = data["checkTime"]
        var response = "";
        for(var i = 0; i < freeFriend.length; i ++){
          response = response + freeFriend[i] + ", "
        }
        console.log("response1 = " + response)
        response = response.slice(0, response.length-2)
        console.log("response = " + response)
        if(freeFriend.length == 0){
          $("#check-result").text("NO FREE FRIENDS on " + date + " at " + time);
        }
        else{
          $("#check-result").text("FREE FRIENDS on " + date + " at " + time + ": " + response);
        }
        console.log("data is")
        console.dir(data)
        console.dir(document.getElementById("check-result"));
        document.getElementById("check-result").style.display = "block";
        document.getElementById("id0211").style.display = "none";
        setTimeout(function(){document.getElementById("check-result").style.display = "none"}, 3000)
      },
      dataType: "json",
    })
  })
})


function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("myOverlay").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("myOverlay").style.display = "none";
}

function myFunc(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        x.previousElementSibling.className += " w3-red";
    } else {
        x.className = x.className.replace(" w3-show", "");
        x.previousElementSibling.className =
        x.previousElementSibling.className.replace(" w3-red", "");
    }
}

function openMail(event) {
    event.preventDefault();
    const personName = event.currentTarget.attributes[1].nodeValue;

    var i;
    var x = document.getElementsByClassName("person");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";
    }
    x = document.getElementsByClassName("test");
    console.log("test length = "  + x.length)
    for (i = 0; i < x.length; i++) {
      console.log("x = " + x[i].className)
       x[i].className = x[i].className.replace("w3-light-grey", "");
    }
    console.log("personname = " + personName)
    document.getElementById(personName).style.display = "block";
    event.currentTarget.className += " w3-light-grey";
}


function openModal(event) {
    event.preventDefault();
    const personName = event.currentTarget.attributes[1].nodeValue;
    console.log("personname = " + personName)
    document.getElementById(personName+"modal").style.display = "block";
}

function closeModal(event) {
    event.preventDefault();
    const personName = event.currentTarget.attributes[1].nodeValue;
    console.log("personname = " + personName)
    document.getElementById(personName+"modal").style.display = "none";
}
//var openTab = document.getElementById("firstTab");
//openTab.click();
