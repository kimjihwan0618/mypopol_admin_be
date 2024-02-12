const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const url = require('url');
const dbPool = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/auth'));
const jwt = require('jsonwebtoken');
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const authCtrl = {
  putAccessToken: async (req, res) => {
    try {
      const authToken = req.headers.authorization;
      const decodedToken = jwt.verify(authToken, 'my_secret_key');
      delete decodedToken.iat;
      delete decodedToken.exp;
      const refreshToken = jwt.sign(decodedToken, 'my_secret_key', { expiresIn: '60m' }); // 개발 중에만 jwt 유효기간 늘려놓음
      res.cookie('token', refreshToken, { httpOnly: true });
      res.status(200).send({
        ...{
          accessToken: refreshToken,
          tokenExpiresIn: new Date().getTime(),
        },
        ...decodedToken,
      });
      logger.info(`jwt 토큰을 재발급하였습니다 : ${refreshToken}`);
    } catch (err) {
      logger.error('accessToken 에러 : ', err);
      res.status(500).json({
        message: 'accessToken 에러',
        timestamp: new Date(),
      });
    }
  },
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

module.exports = authCtrl;
