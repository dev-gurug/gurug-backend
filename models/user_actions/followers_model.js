const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const FollowersSchema = mongoose.Schema({
  sourceId: {
    type: Schema.Types.Mixed,
    required: true,
  },
  sourceName : {
      type : String,
      required : true
  },
  sourceRole : {
      type : String,
      required : true
  },
  targetId: {
    type: Schema.Types.Mixed,
    required: true,
  },
  targetName : {
      type : String,
      required : true
  },
  targetRole : {
      type : String,
      required : true
  },
  createdDate: {
    type: Date,
    required: true,
  }
});

const Followers = mongoose.model("Followers", FollowersSchema);

function validateFollower(req) {
  const schema = Joi.object({
    sourceId: Joi.objectId().required(),
    targetId : Joi.objectId().required(),
    sourceName : Joi.string().required(),
    targetName : Joi.string().required(),
    sourceRole : Joi.string().required(),
    targetRole : Joi.string().required(),
    createdDate: Joi.date().required()
  });
  return schema.validate(req);
}

exports.Followers = Followers;
exports.validateFollower = validateFollower;
