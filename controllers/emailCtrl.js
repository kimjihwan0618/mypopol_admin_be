const nodemailer = require('nodemailer');
const fs = require('fs');
const filePath = "./mailConfig.json"
let mailConfig = "";
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;
  mailConfig = JSON.parse(data);
});

const emailCtrl = {
  sendMail: (req, res) => {
    if (req.method === 'POST' && req.url === '/send') {
      const { from, to, subject, body, pw } = req.body;
      console.log(`Mail Send -> From : ${from}, To : ${to}`);
      if (pw === 'WlGhks010!@#') {
        const transporter = nodemailer.createTransport({
          host: mailConfig.host,
          port: 465,
          secure: true,
          auth: {
            user: mailConfig.user,
            pass: mailConfig.pass,
          },
        });
        const mailOptions = {
          from: mailConfig.user,
          to: to,
          subject: subject,
          html: body,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent Success');
          }
        });
        res.end('/email/send Suc');
      }
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  },
};

module.exports = emailCtrl;
