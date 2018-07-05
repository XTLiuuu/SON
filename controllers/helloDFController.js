exports.process_request =  (req, res) => {
  console.dir(req.body)
  console.log("in process_request")
  var output_string;
  var name;

  // welcome and initialize list
  if(req.body.queryResult.intent.name == "projects/son-bjwhqg/agent/intents/0a65ec9a-eddd-47bb-b7d3-bec8204c1c58"){
    console.log("in Welcome");
    name = req.body.queryResult.parameters["given-name"]
    output_string = exports.welcome(name);
  }

  return res.json({
              "fulfillmentMessages": [],
              "fulfillmentText": output_string,
              "payload": {"slack":{"text": output_string}},
              "outputContexts": [],
              "source": "Text Source",
              "followupEventInput": {}
          });
};

exports.welcome = (name) => {
  console.log("in Welcome function")
  var response = "Hello, " + name + "." + " I'm your personal secretary, Pipi."
  return response;
};
