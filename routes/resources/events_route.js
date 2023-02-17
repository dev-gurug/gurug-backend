const express = require("express");
const { date } = require("joi");
const _ = require("lodash");
const router = express.Router();
const auth = require("../../middleware/auth");
// const guru = require("../../middleware/guru");
const validate = require("../../middleware/validate");
const { Events, validatePost } = require("../../models/resources/events_model");
const mongoose = require("mongoose");
const subAdmin = require("../../middleware/subAdmin");
const admin = require("../../middleware/admin");
const adminSubAdmin = require("../../middleware/adminSubAdmin");

router.get("/", [auth], async (req, res) => {
  const event = await Events.find();
  if (!event) return res.status(404).send("Events does not exist...");
  res.send(event);
});

router.get(
  "/subadminApprovalPending",
  [auth, subAdmin],
  async (req, res) => {
    let events = await Events.find({ user: req.user._id });
    if (!events) return res.send([]);
    events = events.filter((e) => e.disabled);
    if (events.length === 0) return res.send([]);
    res.send(events);
  }
);

router.get("/allSubadminApprovalPending", [auth, admin], async (req, res) => {
  let events;
  events = await Events.find();
  if (!events) return res.send([]);
  events = events.filter((e) => e.disabled);
  if (events.length === 0) return res.send([]);
  res.send(events);
});

router.get("/user", [auth], async (req, res) => {
  console.log(req.user._id);
  const event = await Events.find({ user: req.user._id });
  if (!event) return res.status(404).send("Events do not exist...");
  res.send(event);
});

router.get("/:id", async (req, res) => {
  const event = await Events.findById(req.params.id);
  if (!event) return res.status(404).send("Events does not exist...");
  res.send(event);
});

router.post("/", [auth], async (req, res) => {
  console.log(req);
  let events = Events(
    _.pick(req.body, [
      "title",
      "tags",
      "guruEvent",
      "user",
      "date",
      "eventImage",
      "eventType",
      "nameOfOrganizer",
      "numberOfAttendees",
      "linkOfEvent",
      "adminEvent",
      "userEvent",
      "eventStatus",
      "disabled",
      "description",
      "eventEndTime",
      "eventStartTime",
      "address1",
      "address2",
      "city",
      "state",
      "country",
      "contactNo",
    ])
  );

  try {
    events = await events.save();
    res.send({ ..._.pick(events, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/:id/:eventStatus", [auth], async (req, res) => {
  console.log(req.params.id);
  const event = await Events.findByIdAndUpdate(
    req.params.id,
    { eventStatus: req.params.eventStatus },
    { new: true, useFindAndModify: false, strict: false }
  );
  if (!event) return res.status(404).send("Event does not exist...");
  res.send(event);
});

router.put("/:id", [auth], async (req, res) => {
  console.log(req.params);
  console.log(req.body);
  const event = await Events.findByIdAndUpdate(
    req.params.id,
    {
      eventStatus: req.body.eventStatus,
      tags: req.body.tags,
      description: req.body.description,
      date: req.body.date,
      notes: req.body.notes,
      eventStartTime: req.body.eventStartTime,
      eventEndTime: req.body.eventEndTime,
      title: req.body.title,
      address2: req.body.address2,
      address1: req.body.address1,
      eventType: req.body.eventType,
      eventImage: req.body.eventImage,
      linkOfEvent: req.body.linkOfEvent,
      nameOfOrganizer: req.body.nameOfOrganizer,
      numberOfAttendees: req.body.numberOfAttendees,
      tags: req.body.tags,
      joinedIds: req.body.joinedIds,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      contactNo: req.body.contactNo,
      disabled: req.body.disabled ? true : false,
    },
    { new: true, useFindAndModify: false, strict: false }
  );
  if (!event) return res.status(404).send("Event does not exist...");
  res.send(event);
});

router.put("/enable/:id", [auth, admin], async (req, res) => {
  try {
    const event = await Events.findByIdAndUpdate(
      req.params.id,
      { diabled: false },
      { new: true, useFindAndModify: false, strict: false }
    );
    res.send({ ..._.pick(event, ["_id", "title"]) });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", [auth, adminSubAdmin], async (req, res) => {
  try {
    const event = await Events.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).send("Gyan does not exist...");
    res.status(200).send();
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/addUser/:id", [auth], async (req, res) => {
  console.log(req.params.id);
  console.log(req.body.joinedIds);
  const event = await Events.findByIdAndUpdate(
    mongoose.Types.ObjectId(req.params.id),
    { joinedIds: req.body.joinedIds },
    { new: true, useFindAndModify: false, strict: false }
  );
  if (!event) return res.status(404).send("Event does not exist...");
  console.log(event);
  res.send(event);
});

module.exports = router;
