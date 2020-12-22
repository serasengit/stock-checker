const cron = require("node-cron");
const express = require("express");

// Initialize the app
let app = express();
// Setup server port
const port = process.env.PORT || 4201;
// Launch app to listen to specified port
app.listen(port, function () {
  console.log("Running RestHub on port " + port);
});
// Heroku configuration
// Serve only the static files form the dist directory

app.use(express.static("./dist/stock-checker"));

// Schedule tasks to be run on the server.
cron.schedule("* * * * *", function () {
  console.log("running a task every minute");
});
