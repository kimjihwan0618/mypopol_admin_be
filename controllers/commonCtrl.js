const root = require.main.path;
const url = require('url');
const path = require('path');
const log4js = require('log4js');
const dbPool = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/common'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const commonCtrl = {
  getMenus: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const queryObj = url.parse(req.url, true).query;
      const roleId = queryObj.roleId;
      const [rows, error] = await connection.query(query.getMenus(roleId));
      if (rows.length === 1) {
        res.status(200).send({
          response: rows[0],
        });
      } else {
        res.status(401).json({
          message: '일치하는 권한이 없습니다.',
          timestamp: new Date(),
        });
      }
    } catch (err) {
      res.status(500).json({
        message: 'getMenus error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
      logger.error('getMenus error :', err);
    } finally {
      connection.release();
    }
  },
};

module.exports = commonCtrl;
