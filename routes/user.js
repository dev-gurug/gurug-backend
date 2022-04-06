const express = require("express");
const { User, validate : UserValidation } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.get("/", async (req, res) => {
  const users = await User.find().select("-password");
  console.log(users);
  res.send(users);
});

router.post("/", async (req, res) => {
  const { error } = UserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .send("Email already registered. Please Use another email.");

  if (req.body.isGuru) {
    // user = User(_.pick(req.body, ["firstName", "lastName", "email", "password", "isGuru", "isSubAdmin", "isAdmin"]));
    user = User(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "phone",
        "ministryInfo",
        "bio",
        "country",
        "state",
        "password",
        "isGuru",
      ])
    );
  }

  if (req.body.isUser) {
    // user = User(_.pick(req.body, ["firstName", "lastName", "email", "password", "isGuru", "isSubAdmin", "isAdmin"]));
    user = User(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "isUser",
      ])
    );
  }

  const salt = await bcrypt.genSalt(10);
  console.log(user);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send({
        ..._.pick(user, [
          "_id",
          "firstName",
          "lastName",
          "email",
          "isGuru",
          "isSubAdmin",
          "isAdmin",
          "isUser",
          "isKeyUser",
        ]),
        token,
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", [auth,validate(UserValidation)], async (req, res) => {

  let body;
  if (req.user.isGuru) {
    body = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      ministryInfo: req.body.ministryInfo,
      bio: req.body.bio,
      tags: req.body.tags,
      about: req.body.about,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      zip: req.body.zip,
    };
    if(req.body.image) body.image = req.body.image
  }

  const user = await User.findByIdAndUpdate(req.params.id, body,{ new: true });
  if (!user) return res.status(404).send("The user with the given Id was not found");

  res.send();
});

module.exports = router;
