const config = require("config");
const sgMail = require("@sendgrid/mail");

async function sendEmail(data) {
  sgMail.setApiKey(config.get("sendgridApiKey"));
  const msg = {
    to: data.to, // Change to your recipient
    from: "development.gurug@gmail.com", // Change to your verified sender
    template_id: data.template_id,
    dynamic_template_data: data.variables,
  };
  await sgMail.send(msg);
  return true;
}

module.exports = {
  sendEmail,
};
