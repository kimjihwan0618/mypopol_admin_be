const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const nodemailer = require('nodemailer');
const db = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/email'));
const emailAuth = require(path.join(root, 'config/mail.config'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const emailCtrl = {
  sendMail: (req, res) => {
    try {
      const connection = db();
      req.body.userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const { from, to, subject, body, pw, title } = req.body;
      logger.info(`Mail Send -> From : ${from}, To : ${to}`);
      if (pw === 'WlGhks010!@#') {
        const transporter = nodemailer.createTransport({
          host: emailAuth.host,
          port: 465,
          secure: true,
          auth: {
            user: emailAuth.user,
            pass: emailAuth.pass,
          },
        });
        const mailOptions = {
          from: emailAuth.user,
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
              connection.end();
              logger.info('Email sent Success');
            });
          }
        });
        res.end('/email/send Suc');
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
