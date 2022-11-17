const express = require("express");
const { Invitation, validateInvitation } = require("../../models/invitations");
const { User } = require("../../models/user");
const auth = require("../../middleware/auth")
const admin = require("../../middleware/admin")
const validate = require("../../middleware/validate");
const router = express.Router();
const _ = require("lodash");

const { sendEmail } = require("../../services/sendgrid");

router.get("/:id", async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) return res.status(404).send("Invitation does not exist...");
  res.send(invitation);
});

router.post("/", [auth, admin, validate(validateInvitation)], async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Email already registered. Please Use another email.");

  let sentInvitation = await Invitation.findOne({ email: req.body.email });
  if (sentInvitation) return res.status(400).send("Invitation already sent to this email.");

  let invitationObject = {};
  let emailTemplateId;
  let link;
  if (req.body.keyUser) {
    invitationObject = Invitation(_.pick(req.body, ["firstName", "lastName", "email", "keyUser"]));
    emailTemplateId = "d-c8897463ae8649639d6889326dca2553";
    link = "https://www.guru-g.app/key-user-signup/";
  }

  if (req.body.guru) {
    invitationObject = Invitation(_.pick(req.body, ["firstName", "lastName", "email", "guru"]));
    emailTemplateId = "d-17dc451f235d4da68e868f96a743599f";
    link = "https://www.guru-g.app/guru-signup/";
  }

  if (req.body.subAdmin) {
    invitationObject = Invitation(_.pick(req.body, ["firstName", "lastName", "email", "subAdmin"]));
    emailTemplateId = "d-6f84291ca9d64f859f0aa9254aaa10f9";
    link = "https://www.guru-g.app/subadmin-signup/";
  }

  try {
    let invitation = await invitationObject.save();
    let emailData = {
      to: invitationObject.email,
      template_id: emailTemplateId,
      variables: {
        Weblink: link + invitation._id,
        name: invitationObject.firstName + " " + invitationObject.lastName
      },
    };

    await sendEmail(emailData);
    res.send({
      ..._.pick(invitation, [
        "_id",
        "firstName",
        "lastName",
        "email",
        "keyUser",
        "guru",
        "subAdmin"
      ]),
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
