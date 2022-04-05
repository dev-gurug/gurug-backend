const express = require("express");
const router = express.Router();
const invitations = require("./admin/invitations")

router.use("/invitation",invitations);

module.exports = router;