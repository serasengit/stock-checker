const cron = require("node-cron");
const express = require("express");
const websiteService = require("./services/website.service.js");

// Initialize the app
const app = express();
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
cron.schedule("*/60 * * * * *", function () {
  websiteService.getPage(
    process.env.STOCK_URL ||
      "https://www.pccomponentes.com/buscar/?query=GeForce+RTX+3080"
  );
});
