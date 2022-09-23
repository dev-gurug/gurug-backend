const express = require("express");
const router = express.Router();
const gyan = require("./resources/gyan_route")
const posts = require("./resources/posts_route")
const course = require("./resources/course_route")
const events = require("./resources/events_route")
const guruForum = require("./resources/guruForum_route")
const group = require("./resources/groups_route")
const gpost = require("./resources/gposts_route")
const comment = require("./resources/comment_route")
const badge = require("./resources/badge_route")
const userWall = require("./resources/userWall_route")

router.use("/gyan",gyan);
router.use("/posts", posts);
router.use("/course", course);
router.use("/events", events);
router.use("/guru-forum", guruForum)
router.use("/gposts", gpost);
router.use("/group", group);
router.use("/comments", comment);
router.use("/badges", badge)
router.use("/wall", userWall);


module.exports = router;