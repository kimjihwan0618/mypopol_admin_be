const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const db = require(path.join(root, 'config/db.config'));
const nodemailer = require('nodemailer');
const query = require(path.join(root, 'query/auth'));
const jwt = require('jsonwebtoken');
const queryParse = require(path.join(root, 'utills/queryParse'));
const getErrorCode = require(path.join(root, 'utills/getErrCode'));
const emailAuth = require(path.join(root, 'config/mail.config'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const dbCtrl = {
  signIn: async (req, res) => {
    try {
      const connection = db();
      connection.query(query.getUser(queryParse.singleQuiteParse(req.body)), (error, rows) => {
        if (error) {
          throw error;
        }
        if (rows.length === 1) {
          const user = {
            userKey: `${rows[0].userKey}`,
            userId: `${rows[0].userId}`,
            username: `${rows[0].userName}`,
            roleId: `${rows[0].roleId}`,
            role: `${rows[0].roleName}`,
          };
          const token = jwt.sign(user, 'my_secret_key', { expiresIn: '60m' });
          // 개발 중에만 jwt 유효기간 늘려놓음
          logger.info(`signIn : ${rows[0].userId}`);
          res.cookie('token', token, { httpOnly: true });
          res.send({
            code: 200,
            response: {
              ...{
                accessToken: token,
                tokenExpiresIn: new Date().getTime(),
              },
              ...user,
            },
          });
        } else {
          const code = 401;
          res.status(code).json({
            code: code,
            status: 'Unauthorized',
            message: '일치하는 유저 정보가 없습니다.',
            timestamp: new Date(),
          });
        }
        connection.end();
      });
    } catch (err) {
      logger.error('signIn error : ', err);
      res.status(getErrorCode(err)).json({
        message: 'signIn error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
    }
  },
  // signIn
  accessToken: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'my_secret_key');
      delete decodedToken.iat;
      delete decodedToken.exp;
      const refreshToken = jwt.sign(decodedToken, 'my_secret_key', { expiresIn: '120m' });
      // 개발 중에만 jwt 유효기간 늘려놓음
      res.cookie('token', refreshToken, { httpOnly: true });
      // logger.info(`accessToken : ${rows[0].userId}`);
      res.send({
        code: 200,
        response: {
          ...{
            accessToken: refreshToken,
            tokenExpiresIn: new Date().getTime(),
          },
          ...decodedToken,
        },
      });
    } catch (err) {
      res.status(getErrorCode(err)).json({
        message: 'accessToken token',
        timestamp: new Date(),
      });
    }
  },
  // accessToken
  signCodePub: async (req, res) => {
    try {
      const { email } = req.body;
      const authKey = new Date().getTime();
      const transporter = nodemailer.createTransport({
        host: emailAuth.host,
        port: 466,
        secure: true,
        auth: {
          user: emailAuth.user,
          pass: emailAuth.pass,
        },
      });
      const mailOptions = {
        from: emailAuth.user,
        to: email,
        subject: `[이메일]인증코드 발급`,
        html: '80009850',
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.error(error);
        } else {
          logger.info('Email sent Success');
        }
      });
      res.status(200).send({
        authKey,
      });
    } catch (err) {
      logger.error('signCodePub error : ', err);
      res.status(getErrorCode(err)).send({
        message: 'signCodePub Error',
        timestamp: new Date(),
      });
    }
  },
  // signCodePub
};

module.exports = dbCtrl;
