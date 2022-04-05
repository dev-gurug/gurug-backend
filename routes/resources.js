const express = require("express");
const router = express.Router();
const gyan = require("./resources/gyan_route")

router.use("/gyan",gyan);

module.exports = router;