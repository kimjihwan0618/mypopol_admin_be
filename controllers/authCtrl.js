const db = require('../dbConfig');
const query = require('../query/auth');
const jwt = require('jsonwebtoken');

const dbCtrl = {
  signIn: async (req, res) => {
    try {
      const connection = db();
      connection.query(query.getUser(req.body), (error, rows) => {
        if (error) {
          throw error;
        }
        if (rows.length === 1) {
          const user = {
            userKey: `${rows[0].userKey}`,
            userId: `${rows[0].userId}`,
            username: `${rows[0].userName}`,
            roleId: `${rows[0].roleId}`,
            role: `${rows[0].roleName}`,
          };
          const token = jwt.sign(user, 'my_secret_key', { expiresIn: '5m' });
          res.cookie('token', token, { httpOnly: true });
          res.send({
            code: 200,
            response: {
              ...{
                accessToken: token,
                tokenExpiresIn: new Date().getTime(),
              },
              ...user,
            },
          });
        } else {
          const code = 401;
          res.status(code).json({
            code: code,
            status: 'Unauthorized',
            message: '일치하는 유저 정보가 없습니다.',
            timestamp: new Date(),
          });
        }
        connection.end();
      });
    } catch (err) {
      console.error('signIn error : ', err);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'signIn error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
    }
  },
  // signIn
  accessToken: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'my_secret_key');
      delete decodedToken.iat;
      delete decodedToken.exp;
      const refreshToken = jwt.sign(decodedToken, 'my_secret_key', { expiresIn: '5m' });
      res.cookie('token', refreshToken, { httpOnly: true });
      res.send({
        code: 200,
        response: {
          ...{
            accessToken: refreshToken,
            tokenExpiresIn: new Date().getTime(),
          },
          ...decodedToken,
        },
      });
    } catch (err) {
      console.error('accessToken error : ', err);
      res.status(401).json({
        code: 401,
        status: 'Internal Server Error',
        message: 'Invalid token',
        timestamp: new Date(),
      });
    }
  },
  // accessToken
};

module.exports = dbCtrl;
