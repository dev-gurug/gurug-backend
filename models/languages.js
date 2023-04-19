const mongoose = require("mongoose");
const Joi = require("joi");

const LanguagesSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  }
});


const Language = mongoose.model("Languages", LanguagesSchema);

function validateLanguage(req) {
  const schema = Joi.object({
    title: Joi.string().required(),
  });
  return schema.validate(req);
}

exports.Language = Language;
exports.validateLanguage = validateLanguage;
