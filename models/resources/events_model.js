const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
const { number, date, boolean } = require("joi");

const EventsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 500,
  },
  tags: [String],
  user: {
    type: Schema.Types.Mixed,
    required: true,
  },
  guruEvent: Boolean,
  address2: String,
  description: String,
  linkOfEvent: String,
  nameOfOrganizer: String,
  numberOfAttendees: String,
  address1: String,
  date: String,
  eventImage: String,
  eventType: String,
  userEvent: Boolean,
  isAdmin: Boolean,
  adminEvent: Boolean,
  eventEndTime: String,
  eventStartTime: String,
  eventStatus: String,
  notes: String,
  joinedIds: [String],
  country: String,
  state: String,
  city: String,
  contactNo: Number,
  disabled : Boolean
});




const Events = mongoose.model("Events", EventsSchema);

function validatePost(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(500),
    tags: Joi.array(),
    user: Joi.objectId().required(),
    guruEvent: Joi.boolean(),
  });
  return schema.validate(req);
}

exports.Events = Events;
//exports.validatePost = validatePost;
