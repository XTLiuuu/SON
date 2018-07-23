function validateForm(){
  console.log("in validate form")
  var title = document.myForm.title.value
  if(title == ""){
    window.alert("Please enter a title")
    return false;
  }
  var startDate = document.myForm.startDate.value
  if(startDate == ""){
    window.alert("Please enter a start date")
    return false;
  }
  var startTime = document.myForm.startTime.value
  if(startTime == ""){
    window.alert("Please enter a start time")
    return false;
  }
  var endTime = document.myForm.endTime.value
  var endDate = document.myForm.endDate.value
  var start = new Date(startDate)
  var index = startTime.indexOf(":")
  start.setHours(startTime.slice(0,index), startTime.slice(index + 1, startTime.length))
  console.log("start = " + start)
  if(endDate == ""){
    console.log("here")
    endDate = startDate
  }
  if(endTime == ""){
    console.log("here1")
    endTime = startTime
  }
  var end = new Date(endDate)
  var index1 = endTime.indexOf(":")
  end.setHours(endTime.slice(0,index1), endTime.slice(index1 + 1, endTime.length))
  console.log("end = " + end)
  if(end < start){
    window.alert("Please enter a valid end date")
    return false;
  }
  return true;
}
