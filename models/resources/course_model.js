const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");

const CourseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 500,
  },
  duration : {
    type: String,
    required: true,
  },
  requirements : {
    type: String,
    required: true,
  },
  description : {
    type: String,
    required: true,
  },
  modules: [{
      _id : String,
      title : String,
      description : String,
      lectures : [
          {
              _id : String,
              title : String,
              link : String,
              mediaType : String,
              description : String
          }
      ]
  }],
  tags: [String],
  image : String,
  createdDate : {
      type : Date,
  },
  user: {
    type: Schema.Types.Mixed,
    required: true,
  },
  language : String
});


const Course = mongoose.model("Courses", CourseSchema);

function validateCourse(req) {
  const schema = Joi.object({
    title: Joi.string().required().max(500),
    duration: Joi.string().required(),
    requirements: Joi.string().required(),
    description: Joi.string().required(),
    modules: Joi.array().required(),
    tags: Joi.array(),
    image : Joi.string(),
    language : Joi.string(),
    createdDate : Joi.date().required(),
    user : Joi.objectId().required(),
  });
  return schema.validate(req);
}

exports.Course = Course;
exports.validateCourse = validateCourse;
