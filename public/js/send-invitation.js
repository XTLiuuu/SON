$(document).ready(function(){
  $("input.send-invitation").on('click', function(event){
    event.preventDefault();
    console.log("clicked!")
    const theData = {
      friendname: $("#name").val(),
      friendemail: $("#email").val(),
    }
    console.log(theData)
    $.ajax({
      type: "POST",
      url:"/sendFrequest",
      data: theData,
      success: function(data){
        console.log("inside success")
        console.log(data)
        if(data == "exist"){
          console.log("exist problem")
          window.alert($("#name").val() + " is in your friend list.")
        }
        else if(data == "same"){
          console.log("same problem")
          window.alert("You cannot send a friend request to yourself")
        }
        else if(data == "done"){
          window.alert("Your invitation has been sent.")
        }
      },
      dataType: "json",
    })
  })
})
