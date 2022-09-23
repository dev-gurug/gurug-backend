const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
const guru = require("../../middleware/guru");
const { Course } = require("../../models/resources/course_model");
const { Events } = require("../../models/resources/events_model");
const { GPost } = require("../../models/resources/gposts_model");
const { Group } = require("../../models/resources/group_model");
const { Gyan } = require("../../models/resources/gyan_model");
const { Posts } = require("../../models/resources/posts_model");
const {Followers} = require("../../models/user_actions/followers_model");

router.get("/myWall", [auth], async (req, res) => {
  let userId = req.user._id;

  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 3000);

  const three_days_query = { createdDate: { $gt: cutoff } };
  let resourses = [];

  //Events
  let events = await Events.find(three_days_query);
  if (events?.length > 0) {
    events = events.map((item) => ({ ...item._doc, dataType: "event" }));
    resourses = resourses.concat(events);
  }

  //Gyan
  let gyan = await Gyan.find(three_days_query);
  if (!gyan || gyan.length === 0) gyan = await Gyan.find().limit(2);
  gyan = gyan.map((item) => ({ ...item._doc, dataType: "gyan" }));
  resourses = resourses.concat(gyan);

  //Groups
  const allGroups = await Group.find({ "usersAssociated.userId": userId });
  if (allGroups?.length > 0) {
    const groupIds = allGroups.map((grp) => grp._id);
    //Group Posts
    let gPosts = await GPost.find({
      $and: [{ groupId: { $in: groupIds } }, three_days_query],
    });
    if (!gPosts || gPosts.length === 0)
      gPosts = await GPost.find({ $and: [{ groupId: { $in: groupIds } }] });
    gPosts = gPosts.map((item) => ({ ...item._doc, dataType: "gPost" }));
    resourses = resourses.concat(gPosts);
  }

  //Get Gurus Following
  const follows = await Followers.find({
    $and: [{ sourceId: userId }, { targetRole: "guru" }],
  });
  console.log(follows)
  if (follows?.length > 0) {
    const gurusFollowed = follows.map((follow) => follow.targetId);
    //courses
    let courses = await Course.find({
      $and: [{ user: { $in: gurusFollowed } }, three_days_query],
    });
    if (courses?.length > 0) {
      courses = courses.map((item) => ({ ...item._doc, dataType: "course" }));
      resourses = resourses.concat(courses);
    }
    //Posts
    let posts = await Posts.find({
      $and: [{ user: { $in: gurusFollowed } }, three_days_query],
    });
    if (posts?.length > 0) {
      posts = posts.map((item) => ({ ...item._doc, dataType: "post" }));
      resourses = resourses.concat(posts);
    }
  }

  resourses.sort((a, b) => b.createdDate - a.createdDate);
  res.send(resourses);
});

module.exports = router;
