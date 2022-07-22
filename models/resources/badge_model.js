const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const BadgeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image : {
    type : String,
    required : true
}
});

const Badges = mongoose.model("Badges", BadgeSchema);

function validateBadge(req) {
  const schema = Joi.object({
    title: Joi.string().required(),
    image : Joi.string().required(),
  });
  return schema.validate(req);
}

exports.Badges = Badges;
exports.validateBadge = validateBadge;
