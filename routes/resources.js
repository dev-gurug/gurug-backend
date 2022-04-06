const express = require("express");
const router = express.Router();
const gyan = require("./resources/gyan_route")
const posts = require("./resources/posts_route")

router.use("/gyan",gyan);
router.use("/posts", posts);

module.exports = router;