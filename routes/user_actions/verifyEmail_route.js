const express = require("express");
const _ = require("lodash");
const { sendVerification , verifyCode } = require("../../services/twillio");
const router = express.Router();

router.post("/verifyCode", async (req, res) => {
    if (!req.body.email || !req.body.code) return res.status(404).send("Provide Email or code...");
    try {
      let verification = await verifyCode(req.body.email, req.body.code);
      res.send(verification);
    } catch (error) {
      res.status(400).send(error.message);
    }
});

router.post("/getCode", async (req, res) => {
    console.log("SDf")
  if (!req.body.email) return res.status(404).send("Provide Email...");
  try {
    let verification = await sendVerification(req.body.email);
    res.send(verification);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
