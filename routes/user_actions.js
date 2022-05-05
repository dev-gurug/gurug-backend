const express = require("express");
const router = express.Router();
const followers = require("./user_actions/followers_route")
const verifyEmail = require("./user_actions/verifyEmail_route")
const verifyPhone = require("./user_actions/verifyPhone_route")

router.use("/followers", followers);
router.use("/verify_email", verifyEmail);
router.use("/verify_phone", verifyPhone);

module.exports = router;