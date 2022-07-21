const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Comments, validateComment } = require("../../models/resources/comment_model");


// router.get("/", async (req, res) => {
  //   const post = await Posts.find();
  //   if (!post) return res.status(404).send("Post does not exist...");
  //   res.send(post);
  // });
  

  router.get("/parent/:id", [auth],async (req, res) => {
      const comments = await Comments.find({parent : req.params.id});
      if (!comments.length === 0) return res.send([]);
    comments.sort((comment, nComment) => comment.createdDate - nComment.createdDate)

    
    let userIds = comments.map((comment) => comment.user)
    let users = await User.find({_id : {$in : userIds}})

    users = _.pick(users, ["_id", "image", "firstName", "lastName", "isUser", "isGuru", "isAdmin"])
    comments = comments.map((comment) =>{
        let user1
        users.forEach((user) =>{
            if(user._id === comment.user)user1 = user
        }) 
        comment.user = user1
        return comment
    })

    res.send(comments);
  });

  router.get("/:id", async (req, res) => {
    const comment = await Comments.findById(req.params.id);
    if (!comment) return res.status(404).send("Comment does not exist...");


    let userId = comment.user
    let user = await User.findById(userId)

    comment.user = _.pick(user, ["_id", "image", "firstName", "lastName", "isUser", "isGuru", "isAdmin"])

    res.send(comment);
  });
  
router.post("/", [auth, validate(validateComment)], async (req, res) => {
  let comment = Posts(_.pick(req.body, ["comment", "createdDate", "user", "parent"]));

  try {
    comment = await comment.save();
    res.send({..._.pick(comment, ["_id","comment"])});
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
