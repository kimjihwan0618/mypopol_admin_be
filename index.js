const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));

const port = 3000;
app.listen(port, () => {
  console.log('My Popol API 서버가 시작되었습니다.', port);
});

// api ctrl
app.use('/email', require('./routes/emailRouter'));
app.use('/auth', require('./routes/authRouter'));
app.use('/common', require('./routes/commonRouter'));
app.use('/site', require('./routes/siteRouter'));
app.use('/templateManage', require('./routes/templatemanageRouter'));
