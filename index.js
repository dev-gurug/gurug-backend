const winston = require("winston");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

//-------refactored code in startup folder----------------
// require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/database")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

//-----------------------testing error Handling-------------------------

// const p = Promise.reject(new Error("Something failed miserably!"));
// p.then(() => console.log("Done"));

// throw new Error("something failed during startup.");

const port = process.env.PORT || 3200;
// const hostName = "192.168.0.104"
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => winston.info(`Listning on port ${port}...`));
  console.log("not in test");
}

module.exports = app;