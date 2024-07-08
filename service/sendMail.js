const nodemailer = require("nodemailer");

const sendEmailHelper = (to, subject, html) => {
  return new Promise(function (resolve, reject) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: "API ERROR <" + process.env.FROM_EMAIL + ">",
      to: to,
      subject: subject ,
      html: html,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        resolve({ delivered: false, status: "Fail", error: error });
      } else {
        resolve({ delivered: true, status: "Success", info: info });
      }
    });
  });
};

module.exports = { sendEmailHelper };
