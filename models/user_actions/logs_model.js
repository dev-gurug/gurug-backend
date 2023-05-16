const mongoose = require("mongoose");
const Joi = require("joi");

const LogsSchema = mongoose.Schema({
  action: {
    type: String,
  },
  body: {
    type: Object,
  },
  endpoint: {
    type: String,
  },
  origin: {
    type: String,
  },
  createdDate: {
    type: Date,
  },
});

const Logs = mongoose.model("Logs", LogsSchema);

function validateLog(req) {
  const schema = Joi.object({
    action: Joi.string().optional(),
    body: Joi.object().optional(),
    endpoint: Joi.string().optional(),
    origin: Joi.string().optional(),
    createdDate: Joi.date().optional(),
  });
  return schema.validate(req);
}

exports.Logs = Logs;
exports.validateLog = validateLog;
