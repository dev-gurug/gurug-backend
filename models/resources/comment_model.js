const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const CommentsSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  user: {
      type: Schema.Types.Mixed,
      required: true,
    },
    parent: {
        type: Schema.Types.Mixed,
        required: true,
    },
    createdDate: {
      type: Date,
      required: true,
    },
});

const Comments = mongoose.model("Comments", CommentsSchema);

function validateComment(req) {
  const schema = Joi.object({
    comment: Joi.string().required(),
    user : Joi.objectId().required(),
    parent : Joi.objectId().required(),
    createdDate: Joi.date().required(),
  });
  return schema.validate(req);
}

exports.Comments = Comments;
exports.validateComment = validateComment;
