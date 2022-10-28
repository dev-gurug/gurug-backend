const express = require("express");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Prayer, validatePost } = require("../../models/resources/prayer_model");


router.get("/", async (req, res) => {
    const prayer = await Prayer.find();
    if (!prayer) return res.status(404).send("Post does not exist...");
    res.send(prayer);
});

// router.get("/user", [auth], async (req, res) => {
//   console.log(req.user._id)
//   const group = await Group.find({ user: req.user._id });
//   if (!group) return res.status(404).send("Posts do not exist...");
//   res.send(group);
// });


router.get("/:id", async (req, res) => {
    const prayer = await Prayer.findById(req.params.id);
    if (!prayer) return res.status(404).send("Post does not exist...");
    res.send(prayer);
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

// router.put("/removeGroupManager:id", [auth], async (req, res) => {
//     console.log(req.params);
//     console.log(req.body);
//     const group = await Group.findByIdAndUpdate(req.params.id, { groupManagers: req.body.groupManager },
//         { new: true, useFindAndModify: false, strict: false });
//     if (!group) return res.status(404).send("Event does not exist...");
//     res.send(group);
// });



// router.put("/addManagers:id", [auth], async (req, res) => {
//     console.log(req.params);
//     console.log(req.body);
//     const group = await Group.findByIdAndUpdate(req.params.id, {
//         title: req.body.title, tags: req.body.tags, groupImage: req.body.groupImage,
//         description: req.body.description, groupManagers: req.body.groupManagers,
//         creatorName: req.body.creatorName
//     }, { new: true, useFindAndModify: false, strict: false });
//     if (!group) return res.status(404).send("Event does not exist...");
//     res.send(group);
// });

// router.delete("/:id/", [auth], async (req, res) => {
//     console.log(req.params.id);
//     const event = await Group.findByIdAndDelete(req.params.id, { new: false, useFindAndModify: false, strict: false });
//     if (!event) return res.status(404).send("Event does not exist...");
//     res.send(event);
// });

module.exports = router;

