const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Language } = require("../../models/languages");


router.get("/", async (req, res) => {
    const languages = await Language.find();
    if (!languages) return res.status(404).send("Languages does not exist...");
    res.send(languages);
});


router.get("/:id", async (req, res) => {
    const languages = await Languages.findById(req.params.id);
    if (!languages) return res.status(404).send("Language does not exist...");
    res.send(languages);
});




module.exports = router;

