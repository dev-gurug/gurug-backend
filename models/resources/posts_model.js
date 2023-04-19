const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const PostsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 500,
  },
  tags: [String],
  image: String,
  body: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.Mixed,
    required: true,
  },
  groupId: {
    type :String
  },
  guruPost: Boolean,
  language : {
    type: String
  }
});

const Posts = mongoose.model("Posts", PostsSchema);

function validatePost(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(500),
    tags: Joi.array(),
    body: Joi.string().required(),
    image: Joi.string(),
    user : Joi.objectId().required(),
    groupId : Joi.string().optional().allow(""),
    guruPost : Joi.boolean(),
    createdDate: Joi.date().required(),
    language : Joi.string().required()
  });
  return schema.validate(req);
}

exports.Posts = Posts;
exports.validatePost = validatePost;
