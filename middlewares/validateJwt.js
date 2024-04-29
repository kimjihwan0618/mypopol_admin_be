const jwt = require('jsonwebtoken');
const nodeCache = require('../cache/nodeCache');
const log4js = require('log4js');
const logger = log4js.getLogger('access');

const handleJwtCheck = (req, res, next) => {
  const authToken = req.headers?.authorization;
  try {
    if (authToken) {
      jwt.verify(authToken, 'my_secret_key');
    } else {
      throw new Error('윤저 인증 토큰이 존재하지 않습니다.');
    }
    if (!nodeCache.get(authToken.slice(-20))) { // JWT Black List (로그아웃 or 재발급시 이전토큰 무효처리) 
      jwt.verify(authToken, 'my_secret_key');
      next();
    } else {
      res.status(401).send();
    }
  } catch (err) {
    let code, message;
    switch (err.name) {
      case "Error":
        code = 401;
        message = "유저 인증 토큰이 존재하지 않습니다."
        break;
      case "TokenExpiredError":
        code = 401;
        message = "유저 인증 토큰이 만료되었습니다."
        break;
      case "JsonWebTokenError":
        code = 400;
        message = "유저 인증 토큰이 유효하지 않습니다."
        break;
      default:
        code = 500;
        message = "인증토큰 유효검사 서버 에러"
        break;
    }
    logger.error(`handleJwtCheck error. code : ${code}, message : ${message}`);
    res.status(code).json({
      message
    });
  }
};

module.exports = handleJwtCheck