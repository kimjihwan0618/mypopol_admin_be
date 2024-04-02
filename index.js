const root = require.main.path;
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const app = express();
const jwt = require('jsonwebtoken');
const multer = require('multer');
const log4js = require('log4js');
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
const clientSessions = require('./clientSessions'); // 클라이언트와 세션 ID를 매핑할 맵
// const sslCertPath = path.join(__dirname, 'auth', 'cert.pem'); // NAS 배포 환경
// const sslKeyPath = path.join(__dirname, 'auth', 'privkey.pem'); // NAS 배포 환경
// const sslCert = fs.readFileSync(sslCertPath); // NAS 배포 환경
// const sslKey = fs.readFileSync(sslKeyPath); // NAS 배포 환경
log4js.configure(log4jsConfig);
// cors 허용 호스트
const corsOptions = {
  origin: [
    'http://caribo.me',
    'https://caribo.me',
    'http://admin.mypopol.com',
    'https://admin.mypopol.com',
    'http://site.mypopol.com',
    'https://site.mypopol.com',
    'https://kimjihwan0618.github.io',
    'https://kimjihodo.synology.me',
    'http://localhost:3001',
    'http://127.0.0.1:5500',
  ],
};
// SSL/TLS 인증서 및 개인 키 파일 경로
// const options = {
//   key: sslKey, // NAS 배포 환경
//   cert: sslCert, // NAS 배포 환경
// };
const websocketPort = 3003;
// const server = https.createServer(options, app); // 배포 환경
const server = http.createServer(app); // 개발 환경
const wss = new WebSocket.Server({ server });
const apiPort = 3000;
const upload = multer().any();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(upload);

const handleJwtCheck = (req, res, next) => {
  const authToken = req.headers?.authorization;
  try {
    if (authToken) {
      jwt.verify(authToken, 'my_secret_key');
      next();
    } else {
      res.status(401).send(); // jwt 토큰없을시 401     
    }
  } catch (err) {
    logger.error('handleJwtCheck 서버 에러 : ', err);
    res.status(500).send();
  } finally {
    //
  }
};

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `ws://${req.headers.host}`); // 개발 환경
  // const url = new URL(req.url, `wss://${req.headers.host}`); // 배포 환경
  const userId = url.searchParams.get('userId');
  logger.info(`웹소켓 connection : ${userId}`);
  clientSessions.set(userId, ws); // 세션 ID와 웹소켓 인스턴스를 매핑하여 저장
  ws.on('error', (error) => {
    logger.error(`웹소켓 에러 [userId: ${userId}] : ${error.message}`);
  });

  ws.on('close', () => {
    logger.info(`웹소켓 close : ${userId}`);
    clientSessions.delete(userId);
  });
});

app.listen(apiPort, () => {
  logger.info('My Popol API 서버 Open.', apiPort);
});

server.listen(websocketPort, () => {
  logger.info('My Popol WebSocket 서버 Open.', websocketPort);
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
app.use('/my-page', handleJwtCheck, require('./routes/mypageRouter'));
