const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const GuruForumPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 500,
  },
  body: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.Mixed,
    required: true,
  },
  guru: {
    type: Schema.Types.Mixed,
    required: true,
  },
  likes: [String],
  views: Number,
  comments: Number,
  createdDate: {
    type: Date,
    required: true,
  },
});

const GuruForumPost = mongoose.model("GuruForumPost", GuruForumPostSchema);

function validateGuruForumPost(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(500),
    body: Joi.string().required(),
    user: Joi.objectId().required(),
    guru: Joi.objectId().required(),
    likes: Joi.array(),
    views: Joi.number(),
    comments: Joi.number(),
    createdDate: Joi.date().required(),
  });
  return schema.validate(req);
}

exports.GuruForumPost = GuruForumPost;
exports.validateGuruForumPost = validateGuruForumPost;
