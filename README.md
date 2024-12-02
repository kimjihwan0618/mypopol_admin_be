## Mypopol 백엔드 서버 저장소

### 개요

이 저장소는 Mypopol 서비스의 백엔드 서버 코드 저장소입니다. 

- **Mypopol 사이트 주소**: [https://admin.mypopol.com](https://admin.mypopol.com)
- **Swagger-UI 주소**: [https://kimjihodo.synology.me:3001/api-docs](https://kimjihodo.synology.me:3001/api-docs)

### 사용 기술

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jwt&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Node-Cache](https://img.shields.io/badge/Node_Cache-6DC24B?style=for-the-badge&logo=node.js&logoColor=white)
![Log4js](https://img.shields.io/badge/Log4js-CA5C21?style=for-the-badge&logoColor=white)


- **실행에 필요한 설정 파일**
  - `db.config.js`: MySQL 데이터베이스 구성 파일 
  - `mail.config.js`: 이메일 전송을 위한 SMTP 호스트 설정 파일 
  - `sftp.config.js`: SFTP 연결을 위한 구성 파일 

#### `db.config.js`

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '데이터베이스 호스트 주소',
  user: '데이터베이스 사용자 이름',
  password: '데이터베이스 사용자 암호',
  port: '데이터베이스 포트 번호',
  database: '데이터베이스 이름',
});

module.exports = pool;
```

#### `mail.config.js`

```javascript
const mailHost = {
  "host": "SMTP 호스트 주소",
  "user": "사용자 이메일",
  "pass": "이메일 사용자 비밀번호 OR 발급키"
}

module.exports = mailHost
```

#### `sftp.config.js`

```javascript
const sftpConfig = {
  host: 'SFTP 호스트 주소',
  port: 'SFTP 포트 번호',
  username: 'SFTP 사용자 이름',
  password: 'SFTP 사용자 비밀번호'
};

module.exports = sftpConfig;
```

**배포환경에서 실행 `npm run start_prod` 은 루트 HTTPS 폴더 내에 cert.pem 파일과 privkey.pem 파일이 필요합니다.**
```
├─ cache
├─ config
├─ controllers
├─ https (루트경로에 https)
│     ├─ cert.pem
│     └─ privkey.pem
├─ middewares
....
```
