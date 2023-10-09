const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Posts, validatePost } = require("../../models/resources/posts_model");


// router.get("/", async (req, res) => {
  //   const post = await Posts.find();
  //   if (!post) return res.status(404).send("Post does not exist...");
  //   res.send(post);
  // });
  
  router.get("/user", [auth],async (req, res) => {
    console.log(req.user._id)
    const post = await Posts.find({user : req.user._id});
    if (!post) return res.status(404).send("Posts do not exist...");
    post.sort((a, b) => b.createdDate - a.createdDate);
    res.send(post);
  });

  router.get("/guru/:id", [auth],async (req, res) => {
    const post = await Posts.find({user : req.params.id});
    if (!post) return res.status(404).send("Posts do not exist...");
    post.sort((a, b) => b.createdDate - a.createdDate);
    res.send(post);
  });

  router.get("/:id", async (req, res) => {
    const post = await Posts.findById(req.params.id);
    if (!post) return res.status(404).send("Post does not exist...");
    res.send(post);
  });
  
router.post("/", [auth, validate(validatePost)], async (req, res) => {
  let posts = Posts(_.pick(req.body, ["title", "tags", "body", "image", "createdDate", "guruPost", "user", "groupId", "language"]));

  try {
    posts = await posts.save();
    res.send({..._.pick(posts, ["_id","title"])});
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
