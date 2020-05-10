//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
require('dotenv').config();

// Tell express how to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

// Define static folder for files
app.use(express.static("public"));

// Default page to send to for initial get request of web app
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// How to handle post requests on root page
app.post("/", function(req, res) {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

// Object(s) fields to feed to the api
  var data = {
    members: [
      {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
        }
      }
    ]
  };

// Convert the data to JSON for the api to understand
  var jsonData = JSON.stringify(data);

// Giving mailchimp api the link, method, authorization, and the jsonData
  var options = {
      url: "https://us3.api.mailchimp.com/3.0/lists/9b2510b3d9",
      method: "POST",
      headers: {
        "Authorization": process.env.API_USER + " " + process.env.API_KEY
      },
      body: jsonData
  };


// Telling request what to do if api POST fails or succeeds
request(options, function(error, response, body) {
  if (error) {
    console.log(error);
    res.sendFile(__dirname + "/failure.html");
  }
  else {
    console.log(response.statusCode);

    if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }
  }

});

});

// If api POST fails, allow button redirect to main page
app.post("/failure", function(req, res) {
  res.redirect("/");
});

// Telling express to start server, process.env.PORT for heroku variable port
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running.");
});
