const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const nodemailer = require('nodemailer');
const dbPool = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/email'));
const emailAuth = require(path.join(root, 'config/mail.config'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const emailCtrl = {
  sendMail: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      req.body.userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const { from, to, subject, body, pw, title } = req.body;
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
        transporter.sendMail(mailOptions, async function (error, info) {
          if (error) {
            logger.error(error);
          } else {
            await connection.query(query.insertMailCount(req.body), (error, rows) => {
              if (error) {
                throw error;
              }
              connection.release();
              logger.info(`Mail Send -> From : ${from}, To : ${to}`);
            });
          }
        });
        res.end('/email/send Suc');
      }
    } catch (err) {
      res.status(500).json({
        message: 'sendMail error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
      logger.error('sendMail error : ', err);
    }
  },
};

module.exports = emailCtrl;
