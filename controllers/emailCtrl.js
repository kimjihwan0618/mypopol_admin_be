const db = require('../dbConfig');
const query = require('../query/email');
const nodemailer = require('nodemailer');
const fs = require('fs');
const filePath = './mailConfig.json';
const path = require('path');
const log4js = require('log4js');
const log4jsConfigPath = path.join(__dirname, '../log4js.json');
log4js.configure(log4jsConfigPath);
const logger = log4js.getLogger('access');

let mailConfig = '';
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;
  mailConfig = JSON.parse(data);
});

const emailCtrl = {
  sendMail: (req, res) => {
    try {
      const connection = db();
      const { from, to, subject, body, pw, title } = req.body;
      logger.info(`Mail Send -> From : ${from}, To : ${to}`);
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
          subject: `[${subject}] ${title}`,
          html: body,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.error(error);
          } else {
            connection.query(query.insertMailCount(req.body), (error, rows) => {
              if (error) {
                throw error;
              }
              logger.info('Email sent Success');
            });
          }
        });
      }
    } catch (error) {
      logger.error('sendMail error : ', error);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'sendMail error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
    }
  },
};

module.exports = emailCtrl;
