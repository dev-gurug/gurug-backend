const config = require("config");
const accountSid = config.get("TWILIO_ACCOUNT_SID");
const authToken = config.get("TWILIO_AUTH_TOKEN");
const emailServiceID = config.get("Email_verification_serviceId");
const client = require("twilio")(accountSid, authToken);

async function sendVerification(to) {
  return await client.verify
    .services(emailServiceID)
    .verifications.create({ to, channel: "email" });
}
async function verifyCode(to, code) {
  return await client.verify
    .services(emailServiceID)
    .verificationChecks.create({ to, code });
}

module.exports = {
  sendVerification,
  verifyCode,
};
