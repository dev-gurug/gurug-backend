const express = require("express");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();
const Joi = require("joi");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Username or password..");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(validPassword)
  if (!validPassword) return res.status(400).send("Invalid Username or password..");

  const token = user.generateAuthToken();
  res.send(token);
});

async function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().max(255).email().min(5),
    password: Joi.string().required().min(5).max(255)
  });
  return schema.validate(req);
}
module.exports = router;
