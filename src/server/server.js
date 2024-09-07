// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// importing modules
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");

// setting middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("dist"));
app.use(bodyParser.urlencoded({extended: true,}));
app.use(express.json());
// home route
app.get("/", function (req, res) {
  res.sendFile(path.resolve("dist/index.html"));
});

// POST route
app.post('/add', addInfo);

function addInfo(req, res) {
    projectData['country'] = req.body.country;
    projectData['city'] = req.body.city;
    projectData['temperature'] = req.body.temperature;
    projectData['weatherDesc'] = req.body.weatherDesc;
    projectData['img'] = req.body.img;
    projectData['remainingTime'] = req.body.remainingTime;
    projectData['startDate'] = req.body.startDate;
    res.send(projectData);
}

// Initialize all route with a callback function
app.get('/all', getInfo);

// Callback function to complete GET '/all'
function getInfo(req, res) {
    res.send(projectData);
};

// server test route
app.get('/test', function(req, res) {
  res.json({
    status : 200
  })
})

// Set up and Spin up the server
app.listen(3000, () => {
  console.log('Server up on port 3000');
});
module.exports = app;