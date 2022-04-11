const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Followers, validateFollower } = require("../../models/user_actions/followers_model");


router.get("/follows", async (req, res) => {
    let sourceId = req.query.source
    let targetId = req.query.target
    if(!sourceId || !targetId) return res.status(404).send("wrong request...");

    const followTag = await Followers.find({sourceId, targetId});
    if (!followTag) return res.status(404).send("Follow does not exist...");
    res.send(followTag);
  });
  
  router.get("/guru", [auth, guru],async (req, res) => {
    const followers = await Followers.find({targetId : req.user._id});
    if (!followers) return res.status(404).send("No followers...");
    res.send(followers);
  });

  router.get("/my-gurus", [auth, guru],async (req, res) => {
    const followers = await Followers.find({sourceId : req.user._id, targetRole : "guru"});
    if (!followers) return res.status(404).send("No followers...");
    res.send(followers);
  });

  router.delete("/unfollow", async (req, res) => {
    let sourceId = req.query.source
    let targetId = req.query.target
    if(!sourceId || !targetId) return res.status(404).send("wrong request...");

    const followTag = await Followers.find({sourceId, targetId});
    if (!followTag) return res.status(404).send("Follow does not exist...");
    let ids = followTag.map((tag) => tag._id)
    const unFollow = await Followers.remove({_id : {$in : ids}})
    if(unFollow) return res.send(unFollow);
    res.status(400).send("Delete Failed...");
  });

  router.post("/follow",[auth, validate(validateFollower)], async (req, res) => {

    const followTag = await Followers.find({sourceId :req.body.sourceId, targetId : req.body.targetId});
    if (followTag.length >0 ) return res.status(404).send("Follow exists...");

    let follow = Followers(_.pick(req.body, ["targetId", "sourceId", "targetName", "sourceName", "targetRole", "sourceRole", "createdDate"]));
    
  try {
    follow = await follow.save();
    res.send({..._.pick(follow, ["_id", "targetName", "sourceName"])});
  } catch (error) {
    res.status(400).send(error.message);
  }
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
