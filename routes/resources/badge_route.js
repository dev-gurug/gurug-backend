const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Badges, validateBadge } = require("../../models/resources/badge_model");

router.get("/all", [auth], async (req, res) => {
  const badges = await Badges.find();
  res.send(badges);
});

module.exports = router;
