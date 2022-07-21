const express = require("express");
const router = express.Router();
const gyan = require("./resources/gyan_route")
const posts = require("./resources/posts_route")
const course = require("./resources/course_route")
const events = require("./resources/events_route")
const guruForum = require("./resources/guruForum_route")

router.use("/gyan",gyan);
router.use("/posts", posts);
router.use("/course", course);
router.use("/events", events);
router.use("/guru-forum", guruForum)
module.exports = router;