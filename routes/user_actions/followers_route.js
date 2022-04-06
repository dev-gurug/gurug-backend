const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Followers, validateFollower } = require("../../models/user_actions/followers_model");


// router.get("/", async (req, res) => {
  //   const post = await Posts.find();
  //   if (!post) return res.status(404).send("Post does not exist...");
  //   res.send(post);
  // });
  
  router.get("/guru", [auth, guru],async (req, res) => {
    const followers = await Followers.find({targetId : req.user._id});
    if (!followers) return res.status(404).send("No followers...");
    res.send(followers);
  });

//   router.get("/:id", async (req, res) => {
//     const post = await Posts.findById(req.params.id);
//     if (!post) return res.status(404).send("Post does not exist...");
//     res.send(post);
//   });
  
// router.post("/", [auth, validate(validatePost)], async (req, res) => {
//   let posts = Posts(_.pick(req.body, ["title", "tags", "body", "image", "createdDate", "guruPost", "user", "groupId"]));

//   try {
//     posts = await posts.save();
//     res.send({..._.pick(posts, ["_id","title"])});
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });

module.exports = router;
