const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const dbPool = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/site'));
const queryParse = require(path.join(root, 'utills/queryParse'));
const clientSessions = require(path.join(root, 'clientSessions'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const siteCtrl = {
  postPopolInfo: async (req, res) => {
    const connection = await dbPool.getConnection();
    try {
      req.body.userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      if (req.body.countFlag) {
        await connection.query(query.addVisterCount(req.body));
        const ws = clientSessions.get(req.body.userId);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send({
            message: '방문자 카운트',
            ptId: req.body.ptId,
            userId: req.body.userId,
          });
        }
      }
      const [popols, error] = await connection.query(
        query.getPopolInfo(queryParse.singleQuiteParse(req.body))
      );
      if (popols.length === 1) {
        const [works, error2] = await connection.query(query.getWorks(popols[0].popolSeq));
        res.status(200).send({
          response: {
            popolInfo: popols[0],
            worksInfo: works,
          },
        });
        logger.info(`postPopolInfo : ${req.body.userId}`);
      }
    } catch (err) {
      res.status(500).json({
        message: 'postPopolInfo 에러',
        timestamp: new Date(),
      });
      logger.error('postPopolInfo 에러 :', err);
    } finally {
      connection.release();
    }
  },
};
module.exports = siteCtrl;
