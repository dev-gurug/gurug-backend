const mongoose = require("mongoose");
const Joi = require("joi");

const GyanSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  tags: [String],
  videoLink : String,
  image : String,
  body: {
    type: String,
    required: true,
  },
  createdDate : {
      type : Date,
      required : true
  }
});


const Gyan = mongoose.model("Gyan", GyanSchema);

function validateGyan(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(50),
    tags: Joi.array(),
    body: Joi.string().required(),
    image : Joi.string(),
    videoLink : Joi.string().optional().allow(""),
    createdDate : Joi.date().required(),
  });
  return schema.validate(req);
}

exports.Gyan = Gyan;
exports.validateGyan = validateGyan;
