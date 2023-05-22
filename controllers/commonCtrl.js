const db = require('../dbConfig');
const sftpConfig = require('../sftpConfig');
const query = require('../query/common');
const url = require('url');
const Client = require('ssh2-sftp-client');
const sftp = new Client();

const commonCtrl = {
  getMenus: async (req, res) => {
    const queryObj = url.parse(req.url, true).query;
    const roleId = queryObj.roleId;
    db.query(query.getMenus(roleId),
      (error, rows) => {
        if (error) throw error;
        if (rows.length === 1) {
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
      }
    );
  },
  // getMenus
  testSftp: async (req, res) => {
    const sourceDir = "/web/sources/templates/page/PTID01";
    // const targetDir = "/web/site/PTID01";

    try {
      // SFTP 서버에 연결
      await sftp.connect(sftpConfig);
      // 디렉토리 조회
      const directoryList = await sftp.list(sourceDir);
      console.log(directoryList)
    } catch (err) {
      console.log(err)
    } finally {
      // SFTP 연결 종료
      await sftp.end();
    }

  }
  // testSftp
};

module.exports = commonCtrl;
