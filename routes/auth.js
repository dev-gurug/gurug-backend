const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");
const auth = require("../middleware/auth");
const { sendPhoneVerification, verifyPhoneCode } = require("../services/twillio");
const { Logs } = require("../models/user_actions/logs_model");

router.post("/", async (req, res) => {
  console.log("in login")
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ phone: req.body.phone });
  if (!user) return res.status(400).send("Invalid Username or password..");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(validPassword)
  if (!validPassword) return res.status(400).send("Invalid Username or password..");

  const token = user.generateAuthToken()
  res.send(token);
});

router.post("/requestOTP", async (req,res) =>{

  let log = {
    action: "Send OTP to Login",
    endpoint: "/requestOTP",
    body: req.body,
    origin: req.get("host"),
    createdDate: new Date(),
  };

  log = Logs(log);
  try {
    log = await log.save();
  } catch (err) {
    console.log(err);
  }

  let phone = req.body.phone
  if (!phone) return res.status(404).send("Enter an PhoneNumber...");
  console.log(phone)
  try {
  let user = await User.findOne({ phone });
  if (!user) return res
    .status(400)
    .send("Phone Number not found/Registered. Please check Phone Number.");
  console.log(user._id, "User ID")
    let verification = await sendPhoneVerification(phone);
    res.send(verification);
  } catch (error) {
    console.log(error)
    res.status(400).send(error.message);
  }
})

router.post("/loginWithOTP", async (req,res) =>{
  let phone = req.body.phone
  if (!phone || !req.body.otp) return res.status(404).send("Provide Phone Number or code...");
    try {
      let verification = await verifyPhoneCode(phone, req.body.otp);
      if(verification.status === "approved"){
        let user = await User.findOne({ phone })
        let log = {
          action: "Login with OTP",
          endpoint: "/loginWithOTP",
          body: user,
          origin: req.get("host"),
          createdDate: new Date(),
        };
        log = Logs(log);
        try {
          log = await log.save();
        } catch (err) {
          console.log(err);
        }
        const token = user.generateAuthToken()
        res.send(token);
      }else{
        res.status(400).send("Invalid OTP");
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
})

router.post("/tokenRefresh",[auth], async (req,res) =>{
  const user = await User.findById(req.user._id).select("-password");
  const token = user.generateAuthToken();
  res.send(token);
})

async function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().max(255).email().min(5),
    password: Joi.string().required().min(5).max(255)
  });
  return schema.validate(req);
}
module.exports = router;
