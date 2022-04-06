const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const PostsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
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
});

const Posts = mongoose.model("Posts", PostsSchema);

function validatePost(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(50),
    tags: Joi.array(),
    body: Joi.string().required(),
    image: Joi.string(),
    user : Joi.objectId().required(),
    groupId : Joi.string().optional().allow(""),
    guruPost : Joi.boolean(),
    createdDate: Joi.date().required(),
  });
  return schema.validate(req);
}

exports.Posts = Posts;
exports.validatePost = validatePost;
