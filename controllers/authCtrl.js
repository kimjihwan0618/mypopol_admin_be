const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const fs = require('fs').promises;
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const sftpConfig = require(path.join(root, 'config/sftp.config'));
const dbPool = require(path.join(root, 'config/db.config'));
const nodemailer = require('nodemailer');
const query = require(path.join(root, 'query/auth'));
const jwt = require('jsonwebtoken');
const queryParse = require(path.join(root, 'utills/queryParse'));
const emailAuth = require(path.join(root, 'config/mail.config'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const dbCtrl = {
  postSignIn: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const [users, error] = await connection.query(
        query.getUser(queryParse.singleQuiteParse(req.body))
      );
      if (users.length === 1) {
        const user = {
          userKey: `${users[0].userKey}`,
          userId: `${users[0].userId}`,
          username: `${users[0].userName}`,
          roleId: `${users[0].roleId}`,
          role: `${users[0].roleName}`,
        };
        const token = jwt.sign(user, 'my_secret_key', { expiresIn: '60m' }); // 개발 중에만 jwt 유효기간 늘려놓음
        res.cookie('token', token, { httpOnly: true });
        res.status(200).send({
          ...{
            accessToken: token,
            tokenExpiresIn: new Date().getTime(),
          },
          ...user,
        },);
        logger.info(`유저가 로그인하였습니다. : ${users[0].userId}`);
      } else {
        res.status(204).json({
          message: '일치하는 유저 정보가 없습니다.',
          timestamp: new Date(),
        });
      }
      connection.release();
    } catch (err) {
      logger.error('signIn 에러 : ', err);
      res.status(500).json({
        message: 'signIn 애러',
        timestamp: new Date(),
      });
    }
  },
  putAccessToken: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'my_secret_key');
      delete decodedToken.iat;
      delete decodedToken.exp;
      const refreshToken = jwt.sign(decodedToken, 'my_secret_key', { expiresIn: '120m' });
      // 개발 중에만 jwt 유효기간 늘려놓음
      res.cookie('token', refreshToken, { httpOnly: true });
      res.status(200).send({
        ...{
          accessToken: refreshToken,
          tokenExpiresIn: new Date().getTime(),
        },
        ...decodedToken,
      });
      // logger.info(`jwt 토큰을 발급하였습니다 : ${rows[0].userId}`);
    } catch (err) {
      logger.error('accessToken 에러 : ', err);
      res.status(500).json({
        message: 'accessToken 에러',
        timestamp: new Date(),
      });
    }
  },
  postAuthCode: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { userEmail } = req.body;
      const [users, error] = await connection.query(
        query.getUser(queryParse.singleQuiteParse(req.body))
      );
      if (users.length > 0) {
        res.status(200).send(false);
      } else {
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
          to: userEmail,
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
            logger.error(`signCodePub send error : ${error}`);
          } else {
            logger.info(`회원가입을 위한 본인 인증번호를 발급하였습니다. ${userEmail}`);
          }
        });
        res.status(200).send({
          authKey,
        });
      }
    } catch (err) {
      logger.error('signCodePub 에러 : ', err);
      res.status(500).json({
        message: 'signCodePub 에러',
        timestamp: new Date(),
      });
    }
  },
  getUser: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const [users, error] = await connection.query(
        query.getUser(queryParse.singleQuiteParse(req.query))
      );
      res.send(users.length > 0 ? false : true);
    } catch (err) {
      logger.error('getUser 에러 : ', err);
      res.status(500).send({
        message: 'getUser 에러',
        timestamp: new Date(),
      });
    } finally {
      connection.release();
    }
  },
  postUser: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { templateId, userId } = req.body;
      await connection.beginTransaction();
      await connection.query(query.postUser(req.body));
      await connection.query(query.postPopol(req.body));
      const template_def_src = `/web/site/${templateId}`;
      await sftp.connect(sftpConfig);
      await sftp.mkdir(`${template_def_src}/${userId}`, true);
      const fileList = await sftp.list(`${template_def_src}/example`);
      for (const file of fileList) {
        if (file.type !== 'd') { // 파일 타입 폴더 아닐시만 복사
          const sourcePath = `${template_def_src}/example/${file.name}`
          const destinationPath = `${template_def_src}/${userId}/${file.name}`
          const copy = await sftp.get(sourcePath);
          if (path.extname(file.name) === '.js') {
            const userInput = copy.toString().split("\n");
            userInput[0] = `const userId = '${userId}';`
            await sftp.put(Buffer.from(userInput.join('\n')), destinationPath);
          } else {
            await sftp.put(copy, destinationPath);
          }
        }
      }
      await connection.commit();
      res.status(200).send({
        // 유저발급키 생성후 바로 로그인 넘어갈지 검토
      });

    } catch (err) {
      await connection.rollback();
      logger.error('postSignupUser 에러 : ', err);
      res.status(500).send({
        message: 'postSignupUser 에러',
        timestamp: new Date(),
      });
    } finally {
      connection.release();
    }
  },
};

module.exports = dbCtrl;
