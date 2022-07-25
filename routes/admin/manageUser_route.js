const express = require("express");

const { User } = require("../../models/user");
const {Badges} = require("../../models/resources/badge_model")
const auth = require("../../middleware/auth")
const admin = require("../../middleware/admin")
const validate = require("../../middleware/validate");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");

router.post("/searchUserByName", [auth, admin], async (req, res) => {
 if (!req.body.searchQuery){    
     let users = await User.find();
     return res.send(users)
 }

  let users = await User.find({
    "$expr": {
      "$regexMatch": {
        "input": { "$concat": ["$firstName", " ", "$lastName"] },
        "regex": req.body.searchQuery,  //Your text search here
        "options": "i"
      }
    }
  })

  if (!users) return res.send([]);
  
  const badges = await Badges.find()
    console.log(users[0].badges)
  res.send(users)
});

router.put("/removeBadge",[auth, admin], async (req, res) => {
    if(!req.body.userId || !req.body.badgeId) res.status(400).send("Invalid request...");

    let user = await User.find({_id : req.body.userId});
    user = user[0]

    if (!user) return res.status(404).send("User Does not exist....");

    if(!user.badges) return res.send(user);
    if(!user.badges.length === 0) return res.send(user);
    
    user.badges = user.badges.filter((badgeId) => badgeId !== req.body.badgeId)

    try{
        user = await User.findByIdAndUpdate(user._id, {$set: {badges : user.badges}}, {new : true})
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/addBadge",[auth, admin], async (req, res) => {
    if(!req.body.userId || !req.body.badgeId) res.status(400).send("Invalid request...");

    let user = await User.find({_id : req.body.userId});
    let foundUser = user[0]
    // user = user[0]
    if (!foundUser) return res.status(404).send("User Does not exist....");
    if(!foundUser.badges) foundUser.badges = [] 
    
    foundUser.badges = foundUser.badges.filter((badgeId) => badgeId !== req.body.badgeId)
    foundUser.badges.push(req.body.badgeId)
    console.log(foundUser)
    try{
        foundUser = await User.findByIdAndUpdate(foundUser._id, {$set: {badges : foundUser.badges}}, {new : true})
        res.send(foundUser)
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
