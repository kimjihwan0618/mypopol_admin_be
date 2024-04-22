const express = require('express');
const app = express();
const root = require.main.path;
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const log4js = require('log4js');
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
const clientSessions = require('./clientSessions'); // 클라이언트와 세션 ID를 매핑할 맵
const sslCertPath = path.join(__dirname, 'auth', 'cert.pem');
const sslKeyPath = path.join(__dirname, 'auth', 'privkey.pem');
const sslCert = fs.readFileSync(sslCertPath);
const sslKey = fs.readFileSync(sslKeyPath);
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const specs = swaggerJsdoc(require("./config/swagger.config.json"));
const env = process.env.NODE_ENV;
const envFile = `.env.${env}`;
log4js.configure(log4jsConfig);
dotenv.config({ path: envFile });
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
const options = {
  key: sslKey,
  cert: sslCert,
};
const server = env === "development" ? http.createServer(app) : https.createServer(options, app);
const wss = new WebSocket.Server({ server });
const upload = multer().any();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(upload);

const handleJwtCheck = (req, res, next) => {
  const authToken = req.headers?.authorization;
  try {
    if (authToken) {
      jwt.verify(authToken, 'my_secret_key');
      next();
    } else {
      res.status(401).send();
    }
  } catch (err) {
    logger.error('JWT 인증 에러 : ', err);
    res.status(400).json({
      message: 'JWT 인증 에러'
    });
  }
};

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, env === "development" ? `ws://${req.headers.host}` : `wss://${req.headers.host}`);
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

app.listen(process.env.API_PORT, () => {
  logger.info('My Popol API Open.', process.env.API_PORT);
});

server.listen(process.env.WEBSOCKET_PORT, () => {
  logger.info('My Popol WebSocket Open.', process.env.WEBSOCKET_PORT);
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
