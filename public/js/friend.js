//var openInbox = document.getElementById("myBtn");
//openInbox.click();

$(document).ready(function(){
  $("input.check-avail-submit").on('click', function(event){
    event.preventDefault();
    const fid = event.currentTarget.attributes["fid"].nodeValue
    console.log("clicked!")
    const theData = {
      friendName: $("#friendName"+fid).val(),
      friendEmail: $("#friendEmail"+fid).val(),
      checkDate: $("#checkDate"+fid).val(),
      checkTime: $("#checkTime"+fid).val(),
      check_avail: $("#check").val()
    }
    $.ajax({
      type: "POST",
      url:"/check_avail",
      data: theData,
      success: function(data){
        var name = data["friendName"]
        var date = data["checkDate"]
        var time = data["checkTime"]
        var status = data["checkStatus"]
        $("#check-result").text(name + " is " + status + " on " + date + " at " + time + "!");
        document.getElementById("check-result").style.display = "block";
        document.getElementById(fid+"modal").style.display = "none";
        document.getElementById(fid+"profile").style.display = "none";
        setTimeout(function(){document.getElementById("check-result").style.display = "none"}, 5000)
      },
      dataType: "json",
    })
  })
})


$(document).ready(function(){
  $("input.accept-event").on('click', function(event){
    event.preventDefault();
    console.log("clicked!")
    const nid = event.currentTarget.attributes["nid"].nodeValue
    const theData = {
      id: $("#id" + nid).val(),
      from: $("#from" + nid).val(),
      fromname: $("#fromname" + nid).val(),
      title: $("#title" + nid).val(),
      description: $("#description" + nid).val(),
      startDate: $("#startDate" + nid).val(),
      startTime: $("#startTime" + nid).val(),
      endDate: $("#endDate" + nid).val(),
      endTime: $("#endTime" + nid).val(),
    }
    console.log(theData)
    $.ajax({
      type: "POST",
      url:"/update_event",
      data: theData,
      success: function(data){
        document.getElementById("add" + nid).style.display = "none";
        document.getElementById("decline" + nid).style.display = "none";
        console.log("Yay!")
      },
      dataType: "json",
    })
  })
})

$(document).ready(function(){
  $("input.decline-event").on('click', function(event){
    event.preventDefault();
    console.log("clicked--!")
    const nid = event.currentTarget.attributes["nid"].nodeValue
    const theData = {
      id: $("#id" + nid).val(),
      from: $("#from" + nid).val(),
      fromname: $("#fromname" + nid).val(),
      title: $("#title" + nid).val(),
      description: $("#description" + nid).val(),
      startDate: $("#startDate" + nid).val(),
      startTime: $("#startTime" + nid).val(),
      endDate: $("#endDate" + nid).val(),
      endTime: $("#endTime" + nid).val(),
    }
    console.log(theData)
    $.ajax({
      type: "POST",
      url:"/update_event_decline",
      data: theData,
      success: function(data){
        document.getElementById("add" + nid).style.display = "none";
        document.getElementById("decline" + nid).style.display = "none";
        console.log("Yay!")
      },
      dataType: "json",
    })
  })
})


$(document).ready(function(){
  $("input.guess-free").on('click', function(event){
    event.preventDefault();
    const theData = {
      currUser: $("#currUser").val(),
      currUserID: $("currUserID").val(),
      checkDate: $("#checkDate").val(),
      checkTime: $("#checkTime").val()
    }
    console.log("in input.guess-free")
    // console.dir(theData)
    $.ajax({
      type: "POST",
      url:"/guess_free",
      data: theData,
      success: function(data){
        var freeFriend = data["freeFriend"]
        var date = data["checkDate"]
        var time = data["checkTime"]
        var response = "";
        for(var i = 0; i < freeFriend.length; i ++){
          response = response + freeFriend[i] + ", "
        }
        response = response.slice(0, response.length-2)
        if(freeFriend.length == 0){
          $("#check-result").text("NO FREE FRIENDS on " + date + " at " + time);
        }
        else{
          $("#check-result").text("FREE FRIENDS on " + date + " at " + time + ": " + response);
        }
        document.getElementById("check-result").style.display = "block";
        document.getElementById("id0211").style.display = "none";
        setTimeout(function(){document.getElementById("check-result").style.display = "none"}, 5000)
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
  console.log(id)
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        //x.previousElementSibling.className += " w3-red";
    } else {
        x.className = x.className.replace(" w3-show", "");
        //x.previousElementSibling.className.replace(" w3-red", "");
    }
}

/**
* Open group members
*/
function myFunc1(id) {
  const fid = event.currentTarget.attributes["fid"].nodeValue
  console.log(id + fid)
  id = id + fid
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
        //x.previousElementSibling.className += " w3-red";
    } else {
        x.className = x.className.replace(" w3-show", "");
        //x.previousElementSibling.className.replace(" w3-red", "");
    }
}

function openMail(event) {
    event.preventDefault();
    console.log("in open mail")
    // console.dir(event)
    // console.dir(event.currentTarget.attributes)
    const personName = event.currentTarget.attributes[1].nodeValue;
    console.log("name: " + event.currentTarget.attributes[1].nodeValue)
    console.log(event.currentTarget)
    var i;
    var x = document.getElementsByClassName("person");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";
    }
    x = document.getElementsByClassName("test");
    for (i = 0; i < x.length; i++) {
       x[i].className = x[i].className.replace("w3-light-grey", "");
    }
    console.log("in open mail: " + personName)
    document.getElementById(personName).style.display = "block";
    event.currentTarget.className += " w3-light-grey";
    //document.getElementById("021").style.display = "none";
}

function openModal(event) {
    event.preventDefault();
    console.log(event)
    const personName = event.currentTarget.attributes[1].nodeValue;
    document.getElementById(personName+"modal").style.display = "block";
}

// open profile modal
function openModal1(event) {
    event.preventDefault();
    console.log(event)
    const personName = event.currentTarget.attributes[1].nodeValue;
    document.getElementById(personName+"profile").style.display = "block";
}

function addGroup(event){
  console.log("in add group")
  document.getElementById("addGroup").style.display = "block";
}

function closeModal(event) {
    event.preventDefault();
    const personName = event.currentTarget.attributes[1].nodeValue;
    document.getElementById(personName+"modal").style.display = "none";
}

function closeModal1(event) {
    event.preventDefault();
    const personName = event.currentTarget.attributes[1].nodeValue;
    document.getElementById(personName+"profile").style.display = "none";
}
