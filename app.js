const bodyParser = require("body-parser");
const express = require("express");
// Set up the express app
const app = express();
// database
const mongoose = require("mongoose");
const configDB = require("./app/database_config.js");

// Parse incoming requests data
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

// connect to database container
mongoose
  .connect(
    configDB.url,
    { useNewUrlParser: true }
  )
  .catch(() => process.exit(1));

require("./app/routes.js")(app);
const PORT = 8081;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
