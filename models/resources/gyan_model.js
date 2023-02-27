const mongoose = require("mongoose");
const Joi = require("joi");

const GyanSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 500,
  },
  tags: [String],
  mediaLink : String,
  mediaType : String,
  image : String,
  body: {
    type: String,
    required: true,
  },
  createdDate : {
      type : Date,
      required : true
  },
  adminId : String,
  disabled : Boolean
});

const Gyan = mongoose.model("Gyan", GyanSchema);

function validateGyan(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(500),
    tags: Joi.array(),
    body: Joi.string().required(),
    image : Joi.string(),
    mediaLink : Joi.string().optional().allow(""),
    mediaType : Joi.string().optional().allow(""),
    adminId : Joi.string().optional().allow(""),
    disabled : Joi.boolean(),
    createdDate : Joi.date().required(),
  });
  return schema.validate(req);
}

exports.Gyan = Gyan;
exports.validateGyan = validateGyan;
