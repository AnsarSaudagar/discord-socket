const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ansartest45@gmail.com",
    pass: "ecrm inob kzua weea",
  },
});

var mailOptions = {
  from: "ansartest45@gmail.com",
  to: "ansarsaudagar40@gmail.com",
  subject: "This is a test: test",
  text: "Mail for test",
};

// transporter.sendMail(mailOptions, function(error, info) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response)
//     }
// })

module.exports = transporter;
