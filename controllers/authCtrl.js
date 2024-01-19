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
  postSignIn: async (req, res) => {
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
          res.status(401).json({
            message: '일치하는 유저 정보가 없습니다.',
            timestamp: new Date(),
          });
        }
        connection.end();
      });
    } catch (err) {
      logger.error('signIn 에러 : ', err);
      res.status(getErrorCode(err)).json({
        message: 'signIn 애러',
        timestamp: new Date(),
      });
    }
  },
  postAccessToken: async (req, res) => {
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
      logger.error('accessToken 에러 : ', err);
      res.status(getErrorCode(err)).json({
        message: 'accessToken 에러',
        timestamp: new Date(),
      });
    }
  },
  postAuthCode: async (req, res) => {
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
        subject: `[마이포폴]계정생성 인증코드 발급`,
        html: `
        <p>안녕하세요 마이포폴입니다.</p>
        <br />
        <p>화면에서 인증코드를 입력해주세요</p>
        <br />
        <br />
        <p style="font-weight: bold;">인증코드 : ${authKey}</p>
        `,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.error(error);
        } else {
          logger.info(`계정생성 인증메일 전송. 유저 : ${email}`);
        }
      });
      res.status(200).send({
        authKey,
      });
    } catch (err) {
      logger.error('signCodePub 에러 : ', err);
      res.status(getErrorCode(err)).send({
        message: 'signCodePub 에러',
        timestamp: new Date(),
      });
    }
  },
  getUser: async (req, res) => {
    const connection = db();
    connection.query(query.getUser(queryParse.singleQuiteParse(req.query)), (error, rows) => {
      if (error) {
        throw error;
      }
      res.status(200).send({
        users: rows,
      });
      connection.end();
    });
  }
};

module.exports = dbCtrl;
