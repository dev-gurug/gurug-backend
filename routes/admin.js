const express = require("express");
const router = express.Router();
const manageUser = require("./admin/manageUser_route")

router.use("/invitation",invitations);
router.use("/manageUser",manageUser);

module.exports = router;