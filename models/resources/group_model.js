const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
const { number, date, boolean } = require("joi");

const GroupSchema = mongoose.Schema({
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
  groupImage: String,
  description: String,
  creatorName: String,
  memberCount: Number,
  usersAssociated: [Object],
  groupManagers: [Object],
  language : String,
  createdDate: Date
});


const Group = mongoose.model("Group", GroupSchema);

function validatePost(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(500),
    tags: Joi.array(),
    user: Joi.objectId().required(),
  });
  return schema.validate(req);
}

exports.Group = Group;
//exports.validatePost = validatePost;
