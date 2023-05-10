const express = require("express");
const { zip } = require("lodash");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Prayer, validatePost } = require("../../models/resources/prayer_model");
const admin = require("../../middleware/admin");


router.get("/",[auth], async (req, res) => {
    const prayer = await Prayer.find();
    if (!prayer) return res.status(404).send("Post does not exist...");
    res.send(prayer);
});


router.get("/:id",[auth], async (req, res) => {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).send("Post does not exist...");
    res.send(prayer);
});



router.get("/userID/:user",[auth], async (req, res) => {
    try {
        console.log(req.params, "params")
        const prayer = await Prayer.find({ user: req.params.user });
        if (prayer.length === 0) return res.status(400).send("Prayer does not exist...");
        return res.status(200).send(prayer)
    } catch (err) {
        return res.status(500).send(err.message);
    }
});



router.post("/", [auth], async (req, res) => {
    console.log(req.body);
    let prayer = Prayer(_.pick(req.body, ["title", "description", "user", "createdDate", "prayerCount"]));
    try {
        prayer = await prayer.save();
        res.send({ ..._.pick(prayer, ["_id", "title"]) });
    } catch (error) {
        res.status(400).send(error.message);
    }
});




router.post("/incrementPrayerCount", [auth], async (req, res) => {
    const prayer = await Prayer.findByIdAndUpdate(req.body._id, { usersPrayed: req.body.usersPrayed, prayerCount: req.body.prayerCount },
        { new: true, useFindAndModify: false, strict: false });
    if (!prayer) return res.status(404).send("Event does not exist...");
    res.send(prayer);
});

router.delete("/:id", [auth, admin], async (req, res) => {
    try {
      const prayer = await Prayer.findByIdAndDelete(req.params.id);
      if (!prayer) return res.status(404).send("Prayer does not exist...");
      res.status(200).send();
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

module.exports = router;

