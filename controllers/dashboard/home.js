const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const dbPool = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/dashboard'));
const query2 = require(path.join(root, 'query/site'));
const logger = log4js.getLogger('access');
const WebSocket = require('ws');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
const clientSessions = require(path.join(root, 'ws/clientSessions')); // 클라이언트와 세션 ID를 매핑할 맵
log4js.configure(log4jsConfig);

const homeCtrl = {
  getPopols: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { userKey } = req.query;
      const [popols, error] = await connection.query(query.getPopols(userKey));
      res.status(200).send(popols);
      logger.info(`getPopols : ${userKey}`);
    } catch (err) {
      res.status(500).json({
        message: 'getPopols error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('getPageTemList error :', err);
    } finally {
      connection.release();
    }
  },
  getWorks: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { userKey } = req.query;
      const [works, error] = await connection.query(query.getWorks(userKey));
      res.status(200).send(works);
      logger.info(`getWorks : ${userKey}`);
    } catch (err) {
      res.status(500).json({
        message: 'getWorks error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('getPageTemList error :', err);
    } finally {
      connection.release();
    }
  },
  getVistors: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { userId } = req.query;
      const [vistors, error] = await connection.query(query.getVistors(userId));
      res.status(200).send(vistors);
      logger.info(`getVistors : ${userId}`);
    } catch (err) {
      res.status(500).json({
        message: 'getVistors error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('getVistors error :', err);
    } finally {
      connection.release();
    }
  },
  getMails: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      const { userId } = req.query;
      const [mails, error] = await connection.query(query.getMails(userId));
      res.status(200).send(mails);
      logger.info(`getMails : ${userId}`);
    } catch (err) {
      res.status(500).json({
        message: 'getMails error : 내부 서버 오류가 발생했습니다.',
      });
      logger.error('getMails error :', err);
    } finally {
      connection.release();
    }
  },
  // 웹소켓 이벤트 테스트 API : testWs
  testWs: async (req, res) => {
    const connection = await dbPool.getConnection();
    const ws = clientSessions.get(req.body.userId);
    const [result, error] = await connection.query(query2.addVisterCount({
      userId: req.body.userId,
      ptId: 'ptid01',
      userIp: "127.0.0.1"
    }));
    const [rows] = await connection.query("SELECT * FROM user_daily_visted WHERE countSeq = ?", [result.insertId]);
    if (ws && ws.readyState === WebSocket.OPEN) {
      logger.info(`웹소켓 이벤트 [Info] : ${req.body.userId}`);
      ws.send(JSON.stringify({
        type: '방문자 카운트',
        ptId: "ptid01",
        data: rows[0],
      }));
    } else {
      logger.error(`웹소켓 이벤트 [Error] : ${req.body.userId}`);
    }
    res.status(200).json({
      message: '웹소켓 메세지 보낸뒤 실행 성공',
    });
    connection.release();
  }
};

module.exports = homeCtrl;
