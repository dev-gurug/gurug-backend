const express = require("express");
const { date } = require("joi");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Events, validatePost } = require("../../models/resources/events_model");


router.get("/", async (req, res) => {
  const event = await Events.find();
  if (!event) return res.status(404).send("Post does not exist...");
  res.send(event);
});

router.get("/user", [auth], async (req, res) => {
  console.log(req.user._id)
  const event = await Events.find({ user: req.user._id });
  if (!event) return res.status(404).send("Posts do not exist...");
  res.send(event);
});


router.get("/:id", async (req, res) => {
  const event = await Events.findById(req.params.id);
  if (!event) return res.status(404).send("Post does not exist...");
  res.send(event);
});

router.post("/", [auth], async (req, res) => {
  console.log(req);
  let events = Events(_.pick(req.body, ["title", "tags", "guruEvent", "user", "location", "city", "state", "isPrivate", "date", "eventImage", "eventType", "nameOfOrganizer", "numberOfAttendees", "linkOfEvent", "adminEvent", "userEvent", "eventStatus", "description","eventEndTime","eventStartTime"]));

  try {
    events = await events.save();
    res.send({ ..._.pick(events, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/:id/:eventStatus", [auth], async (req, res) => {
  console.log(req.params.id);
  const event = await Events.findByIdAndUpdate(req.params.id, { eventStatus: req.params.eventStatus },
    { new: true , useFindAndModify: false, strict: false });
  if (!event) return res.status(404).send("Event does not exist...");
  res.send(event);
});


router.put("/:id", [auth], async (req, res) => {
  console.log(req.params);
  console.log(req.body);
   const event = await Events.findByIdAndUpdate(req.params.id, { eventStatus: req.body.eventStatus, tags : req.body.tags, description : req.body.description, date : req.body.date, notes : req.body.notes, eventStartTime : req.body.startTime, eventEndTime : req.body.endTime, isPrivate : req.body.isPrivate, 
  title : req.body.title,city : req.body.city, state : req.body.state, location : req.body.location, eventType : req.body.eventType , eventImage : req.body.eventImage, linkOfEvent : req.body.linkOfEvent , nameOfOrganizer : req.body.nameOfOrganizer, numberOfAttendees : req.body.numberOfAttendees, tags : req.body.tags},
     { new: true , useFindAndModify: false, strict: false });
   if (!event) return res.status(404).send("Event does not exist...");
   res.send(event);
});

router.delete("/:id/", [auth], async (req, res) => {
  console.log(req.params.id);
  const event = await Events.findByIdAndDelete(req.params.id,{ new: false , useFindAndModify: false, strict: false });
  if (!event) return res.status(404).send("Event does not exist...");
  res.send(event);
});

module.exports = router;

