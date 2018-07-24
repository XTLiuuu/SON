//var openInbox = document.getElementById("myBtn");
//openInbox.click();

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
