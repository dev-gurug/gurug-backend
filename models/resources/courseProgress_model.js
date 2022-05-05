const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const CourseProgressSchema = mongoose.Schema({
  title: String,
  image: String,
  courseId: {
    type: Schema.Types.Mixed,
    required: true,
  },
  progress: Object,
  createdDate: {
    type: Date,
  },
  user: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const CourseProgress = mongoose.model("Course_Progress", CourseProgressSchema);

function validateCourseProgress(req) {
  const schema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string(),
    courseId: Joi.objectId().required(),
    progress: Joi.object().optional(),
    createdDate: Joi.date().required(),
    user: Joi.objectId().required(),
  });
  return schema.validate(req);
}

exports.CourseProgress = CourseProgress;
exports.validateCourseProgress = validateCourseProgress;
