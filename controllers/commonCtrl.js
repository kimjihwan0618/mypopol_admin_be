const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const jwt = require('jsonwebtoken');
const dbPool = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/common'));
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const nodeCache = require('../cache/nodeCache');
const bcrypt = require('bcrypt');
const sftpConfig = require(path.join(root, 'config/sftp.config'));
const nodemailer = require('nodemailer');
const queryParse = require(path.join(root, 'utills/queryParse'));
const emailAuth = require(path.join(root, 'config/mail.config'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const commonCtrl = {
  postSignIn: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { password, snsAuthToken, userEmail } = req.body;
      const [users, error] = await connection.query(
        query.getUser(queryParse.singleQuiteParse(req.body))
      );
      const handleSuccess = () => {
        const user = {
          userKey: `${users[0].userKey}`,
          userId: `${users[0].userId}`,
          profileImg: `${users[0].profileImg}`,
          username: `${users[0].userName}`,
          roleId: `${users[0].roleId}`,
          role: `${users[0].roleName}`,
          authType: `${users[0].authType}`,
          authValue: `${users[0].authValue}`,
        };
        const token = jwt.sign(user, 'my_secret_key', { expiresIn: '60m' }); // 개발 중에만 jwt 유효기간 늘려놓음
        res.cookie('token', token, { httpOnly: true });
        res.status(200).send({
          ...{
            accessToken: token,
            tokenExpiresIn: new Date().getTime(),
          },
          ...user,
        });
        logger.info(`유저가 로그인하였습니다. : ${users[0].userId}`);
      };
      const handleFalse = () => {
        res.status(204).send();
        snsAuthToken && nodeCache.set(userEmail, snsAuthToken, 300);
      };
      if (users.length === 1) {
        if (snsAuthToken) {
          handleSuccess();
        } else if (password) {
          const hashPassword = users[0].password;
          const match = await bcrypt.compare(password, hashPassword);
          match ? handleSuccess() : handleFalse();
        }
      } else {
        handleFalse();
      }
    } catch (err) {
      logger.error('signIn 에러 : ', err);
      res.status(500).send({
        message: '로그인 에러',
      });
    } finally {
      connection.release();
    }
  },
  postAuthCode: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { forgotPw, userEmail } = req.body; // 비밀번호 찾기로 호출시 forgotPw = true
      const action = forgotPw ? '비밀번호 찾기' : '계정 생성';
      const [users, error] = await connection.query(
        query.getUser(queryParse.singleQuiteParse(req.body))
      );
      const handleAuthCodeIssuance = async () => {
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
        const authValue = userEmail ? userEmail : users[0].authValue;
        const mailOptions = {
          from: emailAuth.user,
          to: authValue, // authValue 휴대폰 인증번호 발급 추가구현 필요
          subject: `[마이포폴]${action} 인증코드 발급`,
          html: `
          <p>안녕하세요 마이포폴입니다.</p>
          <br />
          <p>화면에서 인증코드를 입력해주세요</p>
          <br />
          <br />
          <p style="font-weight: bold;">인증코드 : ${authKey}</p>
          `,
        };
        await transporter.sendMail(mailOptions);
        nodeCache.set(authValue, authKey, 120);
        logger.info(`${action}을 위한 본인 인증번호를 발급하였습니다. ${userEmail}`);
        res.status(200).send({
          ...(forgotPw && { authValue: users[0].authValue }),
          ...(forgotPw && { authType: users[0].authType }),
        });
      };
      if (users.length > 0) {
        forgotPw
          ? handleAuthCodeIssuance()
          : res.status(409).send({ message: '이미 존재하는 유저 정보' });
      } else {
        forgotPw
          ? res.status(404).send({ message: '유효하지 않은 유저' })
          : handleAuthCodeIssuance();
      }
    } catch (err) {
      logger.error('signCodePub 에러 : ', err);
      res.status(500).send({
        message: 'signCodePub 에러',
      });
    } finally {
      connection.release();
    }
  },
  checkAuthCode: async (req, res) => {
    try {
      const { authValue, authCode } = req.query;
      if (String(nodeCache.get(authValue)) !== String(authCode)) {
        res.status(400).send({ message: '유효하지 않은 인증번호' });
        return;
      }
      nodeCache.ttl(authValue, 300);
      res.status(200).send(nodeCache.get(authValue));
    } catch (err) {
      logger.error('checkAuthCode 에러 : ', err);
      res.status(500).send({
        message: 'checkAuthCode 에러',
      });
    }
  },
  getUser: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const [users, error] = await connection.query(
        query.getUser(queryParse.singleQuiteParse(req.query))
      );
      users.length > 0
        ? res.status(409).send({ message: '이미 사용중인 유저 ID' })
        : res.status(200).send({ message: '사용가능한 유저 ID' });
    } catch (err) {
      logger.error('getUser 에러 : ', err);
      res.status(500).send({
        message: 'getUser 에러',
      });
    } finally {
      connection.release();
    }
  },
  postUser: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { templateId, userId, userName, userKey, password, authType, authValue, authCode } =
        req.body;
      if (String(nodeCache.get(authValue)) !== String(authCode)) {
        res.status(400).send({
          message: '유효하지 않은 접근입니다.',
        });
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      req.body.hashPassword = hash;
      await connection.beginTransaction();
      await connection.query(query.postUser(req.body));
      await connection.query(query.postPopol(req.body));
      await sftp.connect(sftpConfig);
      const template_def_src = `/web/site/${templateId}`;
      await sftp.mkdir(`${template_def_src}/${userId}`, true); // 포트폴리오 템플릿 디렉토리
      await sftp.mkdir(`${template_def_src}/${userId}/img`, true); // 작품 이미지 디렉토리
      await sftp.mkdir(`/web/site/src/img/profile/${userId}`, true); // 프로필 사진 저장 디렉토리
      const fileList = await sftp.list(`${template_def_src}/example`);
      for (const file of fileList) {
        if (file.type !== 'd') {
          const sourcePath = `${template_def_src}/example/${file.name}`;
          const destinationPath = `${template_def_src}/${userId}/${file.name}`;
          const copy = await sftp.get(sourcePath);
          if (path.extname(file.name) === '.js') {
            const userInput = copy.toString().split('\n');
            userInput[0] = `const userId = '${userId}';`;
            await sftp.put(Buffer.from(userInput.join('\n')), destinationPath);
          } else if (path.extname(file.name) === '.html') {
            let html = copy.toString();
            html = html.replace(
              new RegExp(`<meta\\s+property\\s*=\\s*"og:url"\\s+content\\s*=\\s*"[^"]*?"\\s*\\/>`),
              `<meta property="og:url" content="https://site.mypopol.com/${templateId}/${userId}" \/>`
            );
            await sftp.put(Buffer.from(html), destinationPath);
          } else {
            await sftp.put(copy, destinationPath);
          }
        }
      }
      await connection.commit();
      const user = {
        userKey: `${userKey}`,
        profileImg: ``,
        userId: `${userId}`,
        username: `${userName}`,
        roleId: `2`,
        role: `FREE`,
        authType: `${authType}`,
        authValue: `${authValue}`,
      };
      const token = jwt.sign(user, 'my_secret_key', { expiresIn: '60m' }); // 개발 중에만 jwt 유효기간 늘려놓음
      res.cookie('token', token, { httpOnly: true });
      res.status(200).send({
        ...{
          accessToken: token,
          tokenExpiresIn: new Date().getTime(),
        },
        ...user,
      });
      logger.info(`유저가 로그인하였습니다. : ${userId}`);
    } catch (err) {
      await connection.rollback();
      logger.error('postSignupUser 에러 : ', err);
      res.status(500).send({
        message: 'postSignupUser 에러',
      });
    } finally {
      sftp.end();
      connection.release();
    }
  },
  putUserPassword: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { password, authValue, authCode } = req.body;
      if (String(nodeCache.get(authValue)) !== String(authCode)) {
        res.status(400).send(false);
        return;
      }
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      req.body.hashPassword = hash;
      await connection.query(query.updateUserPassword(req.body));
      res.status(200).send(true);
    } catch (err) {
      await connection.rollback();
      logger.error('putUserPassword 에러 : ', err);
      res.status(500).send({
        message: 'putUserPassword 에러',
      });
    } finally {
      connection.release();
    }
  },
};

module.exports = commonCtrl;
