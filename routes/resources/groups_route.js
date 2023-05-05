const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Group } = require("../../models/resources/group_model");

const englishId = "6434f70f3d6fb343e525882f";
const hindiId = "6434f73b3d6fb343e5258830";

router.get("/", [auth],async (req, res) => {
  let language = req.user.language;
  let english;
  if (language === englishId) english = true;

  let group;
  if(english){
    group = await Group.find({language : {$ne : hindiId}});
  }else{
    group = await Group.find();
  }

  if (!group) return res.status(404).send("Groups does not exist...");
  res.send(group);
});

router.get("/user", [auth], async (req, res) => {
  console.log(req.user._id)
  const group = await Group.find({ user: req.user._id });
  if (!group) return res.status(404).send("Groups do not exist...");
  res.send(group);
});


router.get("/:id",[auth], async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).send("Group does not exist...");
  res.send(group);
});


router.post("/", [auth], async (req, res) => {
  console.log(req.body);
  let group = Group(_.pick(req.body, ["title", "tags", "groupImage", "user", "creatorName", "memberCount", "description", "createdDate", "groupManagers", "language"]));
  try {
    group = await group.save();
    res.send({ ..._.pick(group, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});


router.put("/addUser:id", [auth], async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const group = await Group.findByIdAndUpdate(req.params.id, { usersAssociated: req.body.usersAssociated, memberCount: req.body.memberCount },
    { new: true, useFindAndModify: false, strict: false });
  if (!group) return res.status(404).send("Group does not exist...");
  res.send(group);
});

router.put("/removeGroupManager:id", [auth], async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const group = await Group.findByIdAndUpdate(req.params.id, { groupManagers: req.body.groupManager },
    { new: true, useFindAndModify: false, strict: false });
  if (!group) return res.status(404).send("Group does not exist...");
  res.send(group);
});


router.put("/addManagers:id", [auth], async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const group = await Group.findByIdAndUpdate(req.params.id, {
    title: req.body.title, tags: req.body.tags, groupImage: req.body.groupImage,
    description: req.body.description, groupManagers: req.body.groupManagers,
    creatorName: req.body.creatorName, language : req.body.language
  }, { new: true, useFindAndModify: false, strict: false });
  if (!group) return res.status(404).send("Group does not exist...");
  res.send(group);
});

router.delete("/:id", [auth], async (req, res) => {
  try {
    const event = await Group.findByIdAndDelete(req.params.id, { new: false, useFindAndModify: false, strict: false });
    if (!event) return res.status(404).send("Group does not exist...");
    res.send(event);
  } catch (error) {
    return res.status(404).send("Group does not exist...");
  }
});

module.exports = router;

