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
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
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
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
  isGuru: Boolean,
  isSubAdmin: Boolean,
  isKeyUser : Boolean,
  isUser : Boolean
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, 
      firstName: this.firstName, 
      lastName: this.lastName, 
      phone: this.phone, 
      isAdmin: this.isAdmin, 
      isGuru : this.isGuru, 
      isSubAdmin : this.isSubAdmin, 
      isKeyUser : this.isKeyUser, 
      isUser : this.isUser
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

function validate(req) {
  const schema = Joi.object({
    firstName: Joi.string().required().max(50).min(3),
    lastName: Joi.string().required().max(50).min(3),
    email: Joi.string().required().max(255).email().min(5),
    phone: Joi.string().max(50).min(5).optional(),
    ministryInfo : Joi.string().max(1000).optional().allow(""),
    bio : Joi.string().max(1000).optional().allow(""),
    country : Joi.string().max(255).min(2).optional(),
    state : Joi.string().max(255).min(3).optional(),
    password: Joi.string().required().max(255),
    isGuru : Joi.boolean(),
    isAdmin : Joi.boolean(),
    isSubAdmin : Joi.boolean(),
    isKeyUSer : Joi.boolean(),
    isUser : Joi.boolean(),
  });
  return schema.validate(req);
}

exports.User = User;
exports.validate = validate;
