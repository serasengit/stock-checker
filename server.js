const cron = require("node-cron");
const express = require("express");
const websiteService = require("./services/website.service.js");
const emailService = require("./services/email.service.js");

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

// Schedule tasks to be run on the server.
cron.schedule("*/15 * * * * *", async function () {
  const availableProducts = await websiteService.getPage(
    process.env.STOCK_URL ||
      "https://www.pccomponentes.com/buscar/?query=rtx+3080"
  );
  if (availableProducts.length > 0) {
    console.log(
      "Los productos disponibles son: " + JSON.stringify(availableProducts)
    );
    emailService.send_email(availableProducts);
  } else {
    console.log("No hay productos disponibles");
  }
});
