const express = require("express");

const { User } = require("../../models/user");
const {Badges} = require("../../models/resources/badge_model")
const auth = require("../../middleware/auth")
const admin = require("../../middleware/admin")
const validate = require("../../middleware/validate");
const router = express.Router();
const _ = require("lodash");

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
  
  users.forEach((user, i)=>{
    if(user.badges){
        if(user.badges.length > 0){
            let cBadges = []
            badges.forEach((badge) =>{
                user.badges.forEach((userBadge) =>{
                    if(userBadge === badge._id){
                        cBadges.push(badge)
                    }
                })
            })
            users[i].badges = cBadges
        }
    }
  })
  res.send(users)
});

router.put("/removeBadge", async (req, res) => {
    if(!req.body.userId || !req.body.badgeId) res.status(400).send("Invalid request...");

    const user = await User.findById(req.params.userId);
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

router.put("/assignUserBadge", async (req, res) => {
    if(!req.body.userId || !req.body.badgeId) res.status(400).send("Invalid request...");

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send("User Does not exist....");

    if(!user.badges) user.badges = [] 
    
    user.badges = user.badges.filter((badgeId) => badgeId !== req.body.badgeId)
    user.badges.push(req.body.badgeId)
    
    try{
        user = await User.findByIdAndUpdate(user._id, {$set: {badges : user.badges}}, {new : true})
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
