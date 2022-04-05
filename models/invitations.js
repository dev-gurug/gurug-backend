const mongoose = require("mongoose");
const Joi = require("joi");

const InvitationUserSchema = mongoose.Schema({
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
  keyUser : Boolean,
  guru : Boolean
//   phone : {
//     type: String,
//     minlength: 5,
//     maxlength: 255,
//   },
});


const Invitation = mongoose.model("Invitations", InvitationUserSchema);

function validateInvitation(req) {
  const schema = Joi.object({
    firstName: Joi.string().required().max(50).min(3),
    lastName: Joi.string().required().max(50).min(3),
    email: Joi.string().required().max(255).email().min(5),
    keyUser : Joi.boolean(),
    guru : Joi.boolean()
    // phone: Joi.string().max(50).min(5).optional(),
  });
  return schema.validate(req);
}

exports.Invitation = Invitation;
exports.validateInvitation = validateInvitation;
