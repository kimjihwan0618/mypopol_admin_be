const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');
const path = require('path');
const log4js = require('log4js');
const log4jsConfigPath = path.join(__dirname, './log4js.json');
log4js.configure(log4jsConfigPath);
const logger = log4js.getLogger('access');

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

// api ctrl
app.use('/email', require('./routes/emailRouter'));
app.use('/auth', require('./routes/authRouter'));
app.use('/common', require('./routes/commonRouter'));
app.use('/site', require('./routes/siteRouter'));
app.use('/templateManage', require('./routes/templatemanageRouter'));
