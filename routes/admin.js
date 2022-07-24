const express = require("express");
const router = express.Router();
const manageUser = require("./admin/manageUser_route")
const invitations = require("./admin/invitations")

router.use("/invitation",invitations);
router.use("/manageUser",manageUser);

module.exports = router;