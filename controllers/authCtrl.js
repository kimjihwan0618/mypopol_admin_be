const db = require('../dbConfig');
const query = require('../query/auth');
const jwt = require('jsonwebtoken');
const queryParse = require('../utills/queryParse');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const log4js = require('log4js');
const log4jsConfigPath = path.join(__dirname, '../log4js.json');
log4js.configure(log4jsConfigPath);
const logger = log4js.getLogger('access');
const filePath = './mailConfig.json';

let mailConfig = '';
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;
  mailConfig = JSON.parse(data);
});

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
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
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
      logger.error('accessToken error : ', err);
      res.status(401).json({
        code: 401,
        status: 'Internal Server Error',
        message: 'Invalid token',
        timestamp: new Date(),
      });
    }
  },
  // accessToken
  signCodePub: async (req, res) => {
    try {
      const { email } = req.body;
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
    } catch (err) {
      logger.error('signCodePub error : ', err);
      res.status(401).json({
        code: 401,
        status: 'Internal Server Error',
        message: 'Invalid token',
        timestamp: new Date(),
      });
    }
  },
  // signCodePub
};

module.exports = dbCtrl;
