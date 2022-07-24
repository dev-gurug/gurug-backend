const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { GPost, validatePost } = require("../../models/resources/gposts_model");


router.get("/" , async (req, res) => {
  console.log(GPost, "gpost model");
  const group = await GPost.find();
  console.log(group);
  if (!group) return res.status(404).send("Post does not exist...");
  res.send(group);
});

router.get("/:groupId", [auth], async (req, res) => {
  console.log(req.params.groupId)
  const group = await GPost.find({ groupId: req.params.groupId });
  if (!group) return res.status(404).send("Posts do not exist...");
  res.send(group);
});

router.post("/", [auth], async (req, res) => {
  console.log(req.body);
  let group = GPost(_.pick(req.body, ["title", "groupPostImage", "description", "groupId", "date","userId"]));
  try {
    group = await group.save();
    res.send({ ..._.pick(group, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/update", [auth], async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const group = await GPost.findByIdAndUpdate(req.body.id, { title: req.body.title, description: req.body.description, groupPostImage: req.body.groupPostImage },
    { new: true, useFindAndModify: false, strict: false });
  if (!group) return res.status(404).send("Event does not exist...");
  res.send(group);
});

router.get("/fetch/:id", [auth], async (req, res) => {
  const event = await GPost.findById(req.params.id);
  if (!event) return res.status(404).send("Post does not exist...");
  res.send(event);
});

router.post("/incrementview", [auth], async (req, res) => {
  console.log(req.body);
  const group = await GPost.findByIdAndUpdate(req.body._id, { views: req.body.views },
    { new: true, useFindAndModify: false, strict: false });
  if (!group) return res.status(404).send("Event does not exist...");
  res.send(group);
});

router.post("/updatelikes", [auth], async (req, res) => {
  console.log(req.body);
  const group = await GPost.findByIdAndUpdate(req.body._id, { likes: req.body.likes },
    { new: true, useFindAndModify: false, strict: false });
  if (!group) return res.status(404).send("Event does not exist...");
  res.send(group);
});

router.delete("/:id/", [auth], async (req, res) => {
  console.log(req.params.id);
  const event = await GPost.findByIdAndDelete(req.params.id,{ new: false , useFindAndModify: false, strict: false });
  if (!event) return res.status(404).send("Event does not exist...");
  res.send(event);
});

router.put("/post/incrementComments/:id",[auth], async (req, res) => {
  // console.log(req.user._id)
  const post = await GPost.findById(req.params.id);
  if (!post) return res.status(404).send("Forum Post does not exist...");

  try{
      post = await GPost.findByIdAndUpdate(post._id, {$set: {comments : post.comments+1}}, {new : true})
      res.send(post)
  } catch (error) {
      res.status(400).send(error.message);
  }

  res.send(post);
});

// router.get("/:id", async (req, res) => {
//   const group = await Group.findById(req.params.id);
//   if (!group) return res.status(404).send("Post does not exist...");
//   res.send(group);
// });




// router.post("/:id/:eventStatus", [auth], async (req, res) => {
//   console.log(req.params.id);
//   const group = await Group.findByIdAndUpdate(req.params.id, { eventStatus: req.params.eventStatus },
//     { new: true, useFindAndModify: false, strict: false });
//   if (!group) return res.status(404).send("Event does not exist...");
//   res.send(group);
// });




// router.put("/addManagers:id", [auth], async (req, res) => {
//   console.log(req.params);
//   console.log(req.body);
//   const group = await Group.findByIdAndUpdate(req.params.id, { title: req.body.title, tags: req.body.tags, groupImage: req.body.groupImage,
//      description: req.body.description, groupManagers : req.body.groupManagers },
//     { new: true, useFindAndModify: false, strict: false });
//   if (!group) return res.status(404).send("Event does not exist...");
//   res.send(group);
// });

// router.delete("/:id/", [auth], async (req, res) => {
//   console.log(req.params.id);
//   const group = await Group.deleteOne({ id: req.params.id });
//   if (!group) return res.status(404).send("Event does not exist...");
//   res.send(group);
// });

module.exports = router;

