const express = require("express");
const PCComponentesCron = require("./crons/PC_componentes.cron.js");

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
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Cron processes execution
PCComponentesCron.execute("*/15 * * * * *");
