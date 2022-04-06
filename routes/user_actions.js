const express = require("express");
const router = express.Router();
const followers = require("./user_actions/followers_route")

router.use("/followers", followers);

module.exports = router;