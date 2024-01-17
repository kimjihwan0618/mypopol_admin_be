const root = require.main.path;
const path = require('path');
const log4js = require('log4js');
const db = require(path.join(root, 'config/db.config'));
const query = require(path.join(root, 'query/site'));
const queryParse = require(path.join(root, 'utills/queryParse'));
const logger = log4js.getLogger('access');
const log4jsConfig = path.join(root, 'config/log4js.config.json');
log4js.configure(log4jsConfig);

const siteCtrl = {
  getPopolInfo: async (req, res) => {
    try {
      const connection = db();
      req.body.userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      if (req.body.countFlag) {
        connection.query(query.addVisterCount(req.body), (error, res) => {
          if (error) {
            throw error;
          }
        });
      }
      connection.query(
        query.getPopolInfo(queryParse.singleQuiteParse(req.body)),
        (error, rows1) => {
          if (error) {
            throw error;
          }
          if (rows1.length === 1) {
            connection.query(query.getWorks(rows1[0].popolSeq), (error, rows2) => {
              logger.info(`getPopolInfo : ${req.body.userId}`);
              res.status(200).send({
                response: {
                  popolInfo: rows1[0],
                  worksInfo: rows2,
                },
              });
            });
          }
          connection.end();
        }
      );
    } catch (error) {
      logger.error('getPopolInfo error :', error);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'getPopolInfo error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
    }
  },
};
module.exports = siteCtrl;
