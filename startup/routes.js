const express = require("express");
const users = require("../routes/user");
const auth = require("../routes/auth");
const admin = require("../routes/admin");
const resources = require("../routes/resources");
const error = require("../middleware/error");
const cors = require("cors");

module.exports = function(app) {
  //----------------------Setting route handlers--------------------------
  // app.use(cors({ origin: "https://www.guru-g.app" }));
  app.use(cors());
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/admin", admin);
  app.use("/api/resources", resources);
  //--------------------Request pipeline Error handeling---------------------
  app.use(error);
};