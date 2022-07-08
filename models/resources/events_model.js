const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
const { number, date, boolean } = require("joi");

const EventsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  tags: [String],
  user: {
    type: Schema.Types.Mixed,
    required: true,
  },
  guruEvent: Boolean,
  city : String,
  isPrivate : Boolean,
  description : String,
  linkOfEvent : String,
  location : String,
  nameOfOrganizer : String,
  numberOfAttendees : String,
  state:String,
  time : String,
  date : String,
  eventImage : String,
  eventType : String,
  userEvent : Boolean,
  isAdmin : Boolean,
  pendingEvent : Boolean,
  adminEvent : Boolean,
  

});




const Events = mongoose.model("Events", EventsSchema);

function validatePost(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(50),
    tags: Joi.array(),
    user : Joi.objectId().required(),
    guruEvent : Joi.boolean(),
  });
  return schema.validate(req);
}

exports.Events = Events;
//exports.validatePost = validatePost;
