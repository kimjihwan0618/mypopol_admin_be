const db = require('../dbConfig');
const sftpConfig = require('../sftpConfig');
const query = require('../query/common');
const url = require('url');
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const path = require('path');
const log4js = require('log4js');
const log4jsConfigPath = path.join(__dirname, '../log4js.json');
log4js.configure(log4jsConfigPath);
const logger = log4js.getLogger('access');

const commonCtrl = {
  getMenus: async (req, res) => {
    try {
      const queryObj = url.parse(req.url, true).query;
      const roleId = queryObj.roleId;
      const connection = db();
      connection.query(query.getMenus(roleId), (error, rows) => {
        if (error) {
          throw error;
        }
        if (rows.length === 1) {
          // logger.info(`getMenus : ${}`);
          res.send({
            code: 200,
            response: rows[0],
          });
        } else {
          const code = 401;
          res.status(code).json({
            code: code,
            status: 'Unauthorized',
            message: '일치하는 권한이 없습니다.',
            timestamp: new Date(),
          });
        }
        connection.end();
      });
    } catch (error) {
      logger.error('getMenus error :', error);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'getMenus error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
    }
  },
  // getMenus
  testSftp: async (req, res) => {
    const sourceDir = '/web/sources/templates/page/PTID01';
    // const targetDir = "/web/site/PTID01";
    try {
      // SFTP 서버에 연결
      await sftp.connect(sftpConfig);
      // 디렉토리 조회
      const directoryList = await sftp.list(sourceDir);
      logger.info(directoryList);
    } catch (err) {
      logger.info(err);
    } finally {
      // SFTP 연결 종료
      await sftp.end();
    }
  },
  // testSftp
};

module.exports = commonCtrl;
