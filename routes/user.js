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

router.get("/findEmail", async (req, res) => {
  console.log(req.query)
  let email = req.query.email
  if(!email) res.status(404).send("Enter an Email...");

  let user = await User.findOne({ email });
  if (user) res
      .status(400)
      .send("Email already registered. Please Use another email.");

  res.send();
});

router.get("/findPhone", async (req, res) => {
  console.log(req.query)
  let phone = req.query.phone
  if(!phone) res.status(404).send("Enter an PhoneNumber...");

  let user = await User.findOne({ phone });
  if (user) res
      .status(400)
      .send("Phone Number already registered. Please Use another Phone Number.");

  res.send();
});

router.get("/all-gurus", auth, async (req, res) => {
  let searchQuery = {isGuru : true}
  if(req.query.search){
    let tags = req.query.search.split(' ')
        tags = tags.map((tag) => new RegExp(tag.trim(),"i"))
        // let query = tags.map((tag) => ({"title" : {$regex : tag}}))
        let query = tags.map((tag) => ({"firstName" : new RegExp(tag, "i")}))
        tags.forEach((tag) => query.push({"lastName" : new RegExp(tag, "i")}))
        query.push({tags : {$in : tags}})
        searchQuery = {...searchQuery,  $or :query}
        searchQuery = {$and : [searchQuery, { $or :query}]}
  }
  let users = await User.find(searchQuery, {firstName : 1, lastName : 1, image : 1, _id :1});
  res.send(users);
});

router.get("/gurus/:id", auth, async (req, res) => {
    console.log("sd")
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).send("Guru does not exist...");
    res.send(user);
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
  body = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    ministryInfo: req.body.ministryInfo,
    tags: req.body.tags,
    bio: req.body.bio,
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
  }
  if(req.body.image) body.image = req.body.image
  
  if (req.user.isGuru) {
    body.about =  req.body.about
    body.zip = req.body.zip
  } else if(req.user.isUser){
    // some additions
  }

  const user = await User.findByIdAndUpdate(req.params.id, body,{ new: true });
  if (!user) return res.status(404).send("The user with the given Id was not found");

  res.send();
});

module.exports = router;
