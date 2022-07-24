const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
const { number, date, boolean } = require("joi");

const GPostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  
  groupPostImage : String,
  description : String,
  date : Date,
  groupId : String,
  likes: [String],
  views: Number,
  userId : String,
  comments: Number,
});

const GPost = mongoose.model("GPost", GPostSchema);

function validatePost(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(50),
    
  });
  return schema.validate(req);
}

exports.GPost = GPost;
exports.validatePost = validatePost;
