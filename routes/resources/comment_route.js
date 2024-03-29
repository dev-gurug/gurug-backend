const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Badges } = require("../../models/resources/badge_model");
const { Comments, validateComment } = require("../../models/resources/comment_model");
const { User } = require("../../models/user")


// router.get("/", async (req, res) => {
//   const post = await Posts.find();
//   if (!post) return res.status(404).send("Post does not exist...");
//   res.send(post);
// });


router.get("/parent/:id", [auth], async (req, res) => {
  const comments = await Comments.find({ parent: req.params.id });
  if (!comments.length === 0) return res.send([]);
  comments.sort((comment, nComment) => comment.createdDate - nComment.createdDate)


  let userIds = comments.map((comment) => comment.user)
  let users = await User.find({ _id: { $in: userIds } })
  let badges = await Badges.find()

  users = users.map((user) => ({ _id: user._id, image: user.image, firstName: user.firstName, lastName: user.lastName, isUser: user.isUser, isGuru: user.isGuru, isAdmin: user.isAdmin, badges: user.badges }))

  // Get badges and replace with badge ID

  let usersWithbadges = [...users]
  users.forEach((user, i) => {
    if (user.badges?.length > 0) {
      let tempBadges = []
      user.badges.forEach((uBadgeId) => {
        badges.forEach((badge) => {
          if (badge._id.toString() === uBadgeId.toString()) {
            tempBadges.push(badge)
          }
        })
      })
      usersWithbadges[i].badges = tempBadges
    }
  })

  comments.forEach((comment, i) => {
    usersWithbadges.forEach((user) => {
      if (user._id.toString() === comment.user.toString()) {
        comments[i].user = user
      }
    })
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
  let comment = Comments(_.pick(req.body, ["comment", "createdDate", "user", "parent"]));

  try {
    comment = await comment.save();
    res.send({ ..._.pick(comment, ["_id", "comment"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id/", [auth], async (req, res) => {
  console.log(req.params.id);
  const comment = await Comments.findByIdAndDelete(req.params.id, { new: false, useFindAndModify: false, strict: false });
  if (!comment) return res.status(404).send("Comment does not exist...");
  res.send(comment);
});

module.exports = router;
