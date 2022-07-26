const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Group, validatePost } = require("../../models/resources/group_model");


router.get("/", async (req, res) => {
  const group = await Group.find();
  if (!group) return res.status(404).send("Post does not exist...");
  res.send(group);
});

router.get("/user", [auth], async (req, res) => {
  console.log(req.user._id)
  const group = await Group.find({ user: req.user._id });
  if (!group) return res.status(404).send("Posts do not exist...");
  res.send(group);
});


router.get("/:id", async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return res.status(404).send("Post does not exist...");
  res.send(group);
});



router.post("/", [auth], async (req, res) => {
  console.log(req.body);
  let group = Group(_.pick(req.body, ["title", "tags", "groupImage", "user", "creatorName", "memberCount", "description", "phoneNo", "groupManagers", "date", "showPhone"]));
  try {
    group = await group.save();
    res.send({ ..._.pick(group, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/:id/:eventStatus", [auth], async (req, res) => {
  console.log(req.params.id);
  const group = await Group.findByIdAndUpdate(req.params.id, { eventStatus: req.params.eventStatus },
    { new: true, useFindAndModify: false, strict: false });
  if (!group) return res.status(404).send("Event does not exist...");
  res.send(group);
});

router.put("/addUser/:id", [auth], async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const group = await Group.findByIdAndUpdate(req.params.id, { usersAssociated: req.body.usersAssociated , memberCount : req.body.memberCount },
    { new: true, useFindAndModify: false, strict: false });
  if (!group) return res.status(404).send("Event does not exist...");
  res.send(group);
});



router.put("/addManagers:id", [auth], async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const group = await Group.findByIdAndUpdate(req.params.id, {
    title: req.body.title, tags: req.body.tags, groupImage: req.body.groupImage,
    description: req.body.description, groupManagers: req.body.groupManagers, phoneNo: req.body.phoneNo, showPhone: req.body.showPhone,
    creatorName: req.body.creatorName },{ new: true, useFindAndModify: false, strict: false });
  if (!group) return res.status(404).send("Event does not exist...");
  res.send(group);
});

router.delete("/:id/", [auth], async (req, res) => {
  console.log(req.params.id);
  const event = await Group.findByIdAndDelete(req.params.id,{ new: false , useFindAndModify: false, strict: false });
  if (!event) return res.status(404).send("Event does not exist...");
  res.send(event);
});

module.exports = router;

