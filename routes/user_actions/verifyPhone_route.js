const express = require("express");
const _ = require("lodash");
const { sendPhoneVerification , verifyPhoneCode } = require("../../services/twillio");
const router = express.Router();

router.post("/verifyPhoneCode", async (req, res) => {
    if (!req.body.phone || !req.body.code) return res.status(404).send("Provide Phone Number or code...");
    try {
      let verification = await verifyPhoneCode(req.body.phone, req.body.code);
      res.send(verification);
    } catch (error) {
      res.status(400).send(error.message);
    }
});

router.post("/getPhoneCode", async (req, res) => {
    console.log("SDf")
  if (!req.body.phone) return res.status(404).send("Provide Phone...");
  try {
    let verification = await sendPhoneVerification(req.body.phone);
    res.send(verification);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
