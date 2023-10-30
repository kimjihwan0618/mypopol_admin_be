const db = require('../dbConfig');
const query = require('../query/site');
const queryParse = require('../utills/queryParse');
const path = require('path');
const log4js = require('log4js');
const log4jsConfigPath = path.join(__dirname, '../log4js.json');
log4js.configure(log4jsConfigPath);
const logger = log4js.getLogger('access');

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
