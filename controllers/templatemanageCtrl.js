const connection = require('../dbConfig');
const query = require('../query/templatemanage');

const siteCtrl = {
  getPageTemList: async (req, res) => {
    try {
      connection.query(query.getPageTemList(req.body), (error, rows) => {
        res.send({
          response: {
            code: 200,
            response: rows,
          },
        });
      });
    } catch (error) {
      console.error('getPageTemList error :', error);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'getPageTemList error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
    }
  },
};
module.exports = siteCtrl;
