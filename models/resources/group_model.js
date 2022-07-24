const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
const { number, date, boolean } = require("joi");

const GroupSchema = mongoose.Schema({
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
  
  groupImage : String,
  description : String,
  showPhone : Boolean,
  phoneNo : String,
  creatorName : String,
  memberCount : Number,
  usersAssociated : [Object],
  groupManagers : [String],
  date : Date
});




const Group = mongoose.model("Group", GroupSchema);

function validatePost(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(50),
    tags: Joi.array(),
    user : Joi.objectId().required(),
  });
  return schema.validate(req);
}

exports.Group = Group;
//exports.validatePost = validatePost;
