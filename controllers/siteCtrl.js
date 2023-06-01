const connection = require('../dbConfig');
const query = require('../query/site');

const siteCtrl = {
  getPopolInfo: async (req, res) => {
    try {
      connection.query(query.getPopolInfo(req.body), (error, rows1) => {
        if (rows1.length === 1) {
          connection.query(query.getWorks(rows1[0].popolSeq), (error, rows2) => {
            res.send({
              code: 200,
              response: {
                popolInfo: rows1[0],
                worksInfo: rows2,
              },
            });
          })
        }
      });
    } catch (error) {
      console.error('getPopolInfo error :', error);
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
