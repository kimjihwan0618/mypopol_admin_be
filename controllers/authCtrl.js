const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const url = require('url');
const dbPool = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/auth'));
const jwt = require('jsonwebtoken');
const logger = log4js.getLogger('access');
const nodeCache = require('../cache/nodeCache');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
const query2 = require(path.join(root, 'query/common'));
const queryParse = require(path.join(root, 'utills/queryParse'));
log4js.configure(log4jsConfig);

const authCtrl = {
  refreshJwt: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const authToken = req.headers.authorization;
      const decodedToken = jwt.verify(authToken, 'my_secret_key');
      delete decodedToken.iat;
      delete decodedToken.exp;
      const [users, error] = await connection.query(
        query2.getUser(queryParse.singleQuiteParse(decodedToken))
      );
      decodedToken.username = users[0].userName;
      decodedToken.profileImg = users[0].profileImg;
      const refreshToken = jwt.sign(decodedToken, 'my_secret_key', { expiresIn: '60m' }); // 개발 중에만 jwt 유효기간 늘려놓음
      nodeCache.set(req.headers.authorization.slice(-20), "jwt_black_list", 3600);
      res.status(200).send({
        ...{
          accessToken: refreshToken,
          tokenExpiresIn: new Date().getTime(),
        },
        ...decodedToken,
      });
      logger.info(`jwt 토큰을 재발급하였습니다 : ${refreshToken}`);
    } catch (err) {
      logger.error('refreshJwt 에러 : ', err);
      res.status(500).json({
        message: 'refreshJwt 에러',
      });
    } finally {
      connection.release();
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
        res.status(200).json({
          message: '일치하는 권한이 없습니다.',
        });
      }
    } catch (err) {
      res.status(500).json({
        message: 'getMenus error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('getMenus error :', err);
    } finally {
      connection.release();
    }
  },
  logout: async (req, res) => {
    try {
      const params = req.query;
      const { userId } = params;
      const jwt = req.headers.authorization;
      nodeCache.set(jwt.slice(-20), "jwt_black_list", 3600);
      res.status(200).send(true);
      logger.info(`${userId} 유저가 로그아웃 하였습니다.`);
    } catch (err) {
      res.status(500).json({
        message: 'logout error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('logout error :', err);
    }
  }
};

module.exports = authCtrl;
