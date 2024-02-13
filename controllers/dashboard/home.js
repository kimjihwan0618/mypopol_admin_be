const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const dbPool = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/dashboard'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
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
        timestamp: new Date(),
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
        timestamp: new Date(),
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
        timestamp: new Date(),
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
        timestamp: new Date(),
      });
      logger.error('getMails error :', err);
    } finally {
      connection.release();
    }
  },
};

module.exports = homeCtrl;
