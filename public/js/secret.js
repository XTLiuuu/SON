$(document).ready(function(){
  $("input.save-profile").on('click', function(event){
    event.preventDefault();
    console.log("clicked!")
    const theData = {
      name: $("#name").val(),
      email: $("#email").val(),
      phone: $("#phone").val(),
      dob: $("#dob").val(),
      gender: $("#gender").val(),
      home: $("#home").val(),
      about: $("#about").val(),
      secret: $("#secret").val(),
      image: $("#image").val(),
    }
    console.log(theData)
    $.ajax({
      type: "POST",
      url:"/saveProfile",
      data: theData,
      success: function(data){
        console.log("inside success")
        console.log(data)
        if(data.type == "exist"){
          console.log("exist problem")
          window.alert(data.message);
        }
        else if(data.type == "empty"){
          console.log("empty problem")
          window.alert(data.message);
        }
        else{
          window.alert("Your changes have been saved");
          window.open('/setting')
        }
      },
      dataType: "json",
    })
  })
})
