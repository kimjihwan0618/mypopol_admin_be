const root = require.main.path;
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const log4js = require('log4js');
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const corsOptions = {
  origin: [
    'http://caribo.me',
    'https://caribo.me',
    'http://admin.mypopol.com',
    'https://admin.mypopol.com',
    'http://site.mypopol.com',
    'https://site.mypopol.com',
    'https://kimjihodo.synology.me',
    'http://localhost:3001',
    'http://127.0.0.1:5500',
  ],
};
// cors 허용 호스트

const handleJwtCheck = (req, res, next) => {
  const authToken = req.headers.authorization;
  try {
    jwt.verify(authToken, 'my_secret_key');
    next();
  } catch (err) {
    logger.error('handleJwtCheck 에러 : ', err);
    res.status(401).send(); // jwt 토큰없을시 401
  } finally {
    //
  }
};

const upload = multer().any();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(upload);

const port = 3000;
app.listen(port, () => {
  logger.info('My Popol API 서버가 시작되었습니다.', port);
});

// 사용자 페이지 api jwt X
app.use('/email', require('./routes/emailRouter'));
app.use('/site', require('./routes/siteRouter'));

// 관리자 페이지 api jwt X
app.use('/common', require('./routes/commonRouter'));

// 관리자 페이지 api jwt O
app.use('/auth', handleJwtCheck, require('./routes/authRouter'));
app.use('/templateManage', handleJwtCheck, require('./routes/templatemanageRouter'));
app.use('/dashboard', handleJwtCheck, require('./routes/dashboardRouter'));
