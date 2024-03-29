const express = require("express");
const { User, validate: UserValidation } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { Badges } = require("../models/resources/badge_model");
const {
  sendPhoneVerification,
  verifyPhoneCode,
} = require("../services/twillio");

router.get("/getAllTypes", async (req, res) => {
  let users = await User.find();
  let data = {
    gurus : 0,
    users : 0,
    subAdmins : 0,
    admins : 0,
    total : users.length
  }

  users.forEach((u) =>{
    if(u.isUser) data.users = data.users + 1
    if(u.isGuru) data.gurus = data.gurus + 1
    if(u.isSubAdmin) data.subAdmins = data.subAdmins + 1
    if(u.isAdmin) data.admins = data.admins + 1
  })

  res.send(data);
})


router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user.badges) {
    const badges = await Badges.find({ _id: { $in: user.badges } });
    console.log(badges);
    if (user.badges.length > 0) {
      let cBadges = [];
      badges.forEach((badge) => {
        user.badges.forEach((userBadge) => {
          if (userBadge === badge._id.toString()) {
            cBadges.push(badge);
          }
        });
      });
      user.badges = cBadges;
    } else {
      user.badges = [];
    }
  }

  res.send(user);
});

router.get("/findEmail", async (req, res) => {
  console.log(req.query);
  let email = req.query.email;
  if (!email) res.status(404).send("Enter an Email...");

  let user = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .send("Email already registered. Please Use another email.");

  res.send();
});

router.get("/findPhone", async (req, res) => {
  console.log(req.query);
  let phone = req.query.phone;
  if (!phone) res.status(404).send("Enter an PhoneNumber...");

  let user = await User.findOne({ phone });
  if (user)
    return res
      .status(400)
      .send(
        "Phone Number already registered. Please Use another Phone Number."
      );

  res.send();
});

router.get("/forgotPassword", async (req, res) => {
  console.log(req.query);
  let phone = req.query.phone;
  phone = "+" + phone.trim();
  if (!phone) return res.status(404).send("Enter an PhoneNumber...");
  console.log(phone);
  let user = await User.findOne({ phone });
  if (!user)
    return res
      .status(400)
      .send("Phone Number not found/Registered. Please check Phone Number.");
  console.log(user._id, "User ID");
  try {
    let verification = await sendPhoneVerification(phone);
    res.send(verification);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/all-gurus", auth, async (req, res) => {
  let searchQuery = { isGuru: true };
  if (req.query.search) {
    let tags = req.query.search.split(" ");
    tags = tags.map((tag) => new RegExp(tag.trim(), "i"));
    // let query = tags.map((tag) => ({"title" : {$regex : tag}}))
    let query = tags.map((tag) => ({ firstName: new RegExp(tag, "i") }));
    tags.forEach((tag) => query.push({ lastName: new RegExp(tag, "i") }));
    query.push({ tags: { $in: tags } });
    searchQuery = { ...searchQuery, $or: query };
    searchQuery = { $and: [searchQuery, { $or: query }] };
  }
  let users = await User.find(searchQuery, {
    firstName: 1,
    lastName: 1,
    image: 1,
    _id: 1,
  });
  res.send(users);
});

router.get("/all-keyUsers", auth, async (req, res) => {
  console.log("in route all-key");
  let users = await User.find({ isKeyUser: true }).select("-password");
  console.log(users);
  if (!users) return res.status(404).send("No Key User exist...");
  res.send(users);
});

router.get("/gurus/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).send("Guru does not exist...");
  res.send(user);
});

router.put("/regeneratePassword", async (req, res) => {
  console.log(req.query);
  let phone = req.body.phone;
  let pass = req.body.pass;
  if (!phone) return res.status(404).send("Enter an PhoneNumber...");

  let user = await User.findOne({ phone });
  if (!user)
    return res
      .status(400)
      .send("Phone Number not found/Registered. Please check Phone Number.");

  const salt = await bcrypt.genSalt(10);
  console.log(user);
  pass = await bcrypt.hash(pass, salt);

  try {
    await User.findByIdAndUpdate(
      user._id,
      { $set: { password: pass } },
      { new: true }
    );
    res.send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/", async (req, res) => {
  const { error } = UserValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ phone: req.body.phone });

  if (user)
    return res
      .status(400)
      .send("Phone already registered. Please Use another Phone no.");

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
        "isGuru",
        "language",
      ])
    );
  }

  if (req.body.isSubAdmin) {
    // user = User(_.pick(req.body, ["firstName", "lastName", "email", "password", "isGuru", "isSubAdmin", "isAdmin"]));
    user = User(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "phone",
        "isSubAdmin",
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
        "dob",
        "phone",
        "isUser",
        "language",
      ])
    );
  }

  if (req.body.isKeyUser) {
    // user = User(_.pick(req.body, ["firstName", "lastName", "email", "password", "isGuru", "isSubAdmin", "isAdmin"]));
    console.log("is key user");
    user = User(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "email",
        "phone",
        "isKeyUser",
      ])
    );
  }

  // const salt = await bcrypt.genSalt(10);
  // console.log(user);
  // user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
      ..._.pick(user, [
        "_id",
        "firstName",
        "lastName",
        "email",
        "isGuru",
        "dob",
        "isSubAdmin",
        "isAdmin",
        "isUser",
        "isKeyUser",
        "language",
      ]),
      token,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", [auth, validate(UserValidation)], async (req, res) => {

  let body = {};
  
  if (req.body.firstName !== undefined) body.firstName = req.body.firstName;
  if (req.body.lastName !== undefined) body.lastName = req.body.lastName;
  if (req.body.dob !== undefined) body.dob = req.body.dob;
  if (req.body.ministryInfo !== undefined)
    body.ministryInfo = req.body.ministryInfo;
  if (req.body.tags !== undefined) body.tags = req.body.tags;
  if (req.body.email !== undefined) body.email = req.body.email;
  if (req.body.badges !== undefined) body.badges = req.body.badges;
  if (req.body.bio !== undefined) body.bio = req.body.bio;
  if (req.body.country !== undefined) body.country = req.body.country;
  if (req.body.language !== undefined) body.language = req.body.language;
  if (req.body.state !== undefined) body.state = req.body.state;
  if (req.body.city !== undefined) body.city = req.body.city;

  if (req.body.image) body.image = req.body.image;

  if (req.user.isGuru) {
    if (req.body.about !== undefined) body.about = req.body.about;
    if (req.body.zip !== undefined)body.zip = req.body.zip;
  } else if (req.user.isUser) {
    // some additions
  }

  const user = await User.findByIdAndUpdate(req.params.id, body, { new: true });
  if (!user)
    return res.status(404).send("The user with the given Id was not found");

  res.send();
});

module.exports = router;
