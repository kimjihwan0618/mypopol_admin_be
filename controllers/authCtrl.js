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
          res.cookie('token', token, { httpOnly: true });
          res.status(200).send({
            response: {
              ...{
                accessToken: token,
                tokenExpiresIn: new Date().getTime(),
              },
              ...user,
            },
          });
          logger.info(`유저가 로그인하였습니다. : ${rows[0].userId}`);
        } else {
          res.status(401).send({
            status: 'Unauthorized',
            message: '로그인 정보가 일치하는 유저가 없습니다.',
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
      res.status(200).send({
        response: {
          ...{
            accessToken: refreshToken,
            tokenExpiresIn: new Date().getTime(),
          },
          ...decodedToken,
        },
      });
      logger.info(`jwt 토큰을 발급하였습니다 : ${rows[0].userId}`);
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
      const authKey = String(new Date().getTime()).slice(-8);
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
        to: email,
        subject: `[이메일]인증코드 발급`,
        html: `<div>
        <p>화면에서 인증코드를 입력해주세요</p><br />
        <p style="font-weight : bold;">인증코드 : ${authKey}</p>
        </div>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.error(`signCodePub send error : ${error}`);
        } else {
          logger.info(`회원가입을 위한 본인 인증번호를 발급하였습니다. ${email}`);
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
