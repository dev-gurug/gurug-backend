const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  dob: {
    type: Date
  },
  email: {
    type: String,
  },
  phone : {
    type: String,
    minlength: 5,
    maxlength: 255,
  },
  ministryInfo : {
    type: String,
    maxlength: 1000,
  },
  bio : {
    type: String,
    maxlength: 1000,
  },
  about : {
    type: String,
    maxlength: 1000,
  },
  tags : Array,
  country : {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  state : {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  city : {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  zip : {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  badges : Array,
  image : {
    type: String,
  },
  isAdmin: Boolean,
  isGuru: Boolean,
  isSubAdmin: Boolean,
  isKeyUser : Boolean,
  isUser : Boolean,
  language : String,
  disabled :Boolean
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, 
      firstName: this.firstName, 
      lastName: this.lastName, 
      dob: this.dob,
      phone: this.phone, 
      isAdmin: this.isAdmin, 
      isGuru : this.isGuru,
      image : this.image,
      isSubAdmin : this.isSubAdmin, 
      isKeyUser : this.isKeyUser, 
      isUser : this.isUser,
      language : this.language,
      disabled : this.disabled
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validate(req) {
  const schema = Joi.object({
    firstName: Joi.string().required().max(50).min(3),
    lastName: Joi.string().required().max(50).min(3),
    email: Joi.string().email().optional().allow(""),
    dob: Joi.date().optional().allow(""),
    phone: Joi.string().max(50).min(5).optional().allow(""),
    ministryInfo : Joi.string().max(1000).optional().allow(""),
    bio : Joi.string().max(1000).optional().allow(""),
    tags : Joi.array().optional(),
    badges : Joi.array().optional(),
    about : Joi.string().max(1000).optional().allow(""),
    country : Joi.string().max(255).min(2).optional().allow(""),
    state : Joi.string().max(255).min(3).optional().allow(""),
    city : Joi.string().max(255).min(3).optional().allow(""),
    zip : Joi.string().max(255).min(2).optional().allow(""),
    image : Joi.string().optional().allow(""),
    isGuru : Joi.boolean(),
    isAdmin : Joi.boolean(),
    isSubAdmin : Joi.boolean(),
    isKeyUser : Joi.boolean(),
    isUser : Joi.boolean(),
    language : Joi.string().optional().allow(""),
    disabled : Joi.boolean()
  });
  return schema.validate(req);
}

exports.User = User;
exports.userSchema = userSchema;
exports.validate = validate;
