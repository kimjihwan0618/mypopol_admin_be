const root = require.main.path;
const url = require('url');
const path = require('path');
const log4js = require('log4js');
const db = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/common'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config');
log4js.configure(log4jsConfig);

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
};

module.exports = commonCtrl;
