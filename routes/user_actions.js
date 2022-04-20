const express = require("express");
const router = express.Router();
const followers = require("./user_actions/followers_route")
const verify = require("./user_actions/verifyEmail_route")

router.use("/followers", followers);
router.use("/verify_email", verify);

module.exports = router;