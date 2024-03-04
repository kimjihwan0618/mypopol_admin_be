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
        await transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            logger.info("들어오긴 하니 2?")
            logger.error(error);
          } else {
            logger.info("들어오긴 하니 3?")
            connection.query(query.insertMailCount(req.body))
            logger.info(`Mail Send -> From : ${from}, To : ${to}`);
          }
        });
        res.status(200).json({ success: true, message: 'Mail sent successfully.' });
      } else {
        res.status(403).json({ success: false, message: 'Invalid password.' });
      }
    } catch (err) {
      res.status(500).json({
        message: 'sendMail error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
      logger.error('sendMail error : ', err);
    } finally {
      connection.release();
    }
  },
};

module.exports = emailCtrl;
