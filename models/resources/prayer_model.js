const mongoose = require("mongoose");
const Joi = require("joi");
const { Schema } = require("mongoose");
const { number, date, boolean } = require("joi");

const PrayerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50,
    },
    user: {
        type: String,
        required: true,
    },
    description: String,
    usersPrayed: [String],
    createdDate: Date,
    prayerCount: Number
});


const Prayer = mongoose.model("Prayer", PrayerSchema);

function validatePost(req) {
    const schema = Joi.object({
        title: Joi.string().required().max(50),
        tags: Joi.array(),
        user: Joi.objectId().required(),
    });
    return schema.validate(req);
}

exports.Prayer = Prayer;
//exports.validatePost = validatePost;
