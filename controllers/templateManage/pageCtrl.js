const db = require('../../dbConfig');
const query = require('../../query/templateManage');

const siteCtrl = {
  getPageTemList: async (req, res) => {
    try {
      const connection = db();
      connection.query(query.getPageTemList(req.body), (error, rows) => {
        if (error) {
          throw error;
        }
        res.send({
          response: {
            code: 200,
            response: rows,
          },
        });
        connection.end();
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
  updatePageTem: async (req, res) => {
    try {
      console.log('--------------------------------------req');
      console.log(req.body.fields); // fields 데이터 가져오기
      console.log(req.files.files); // files 데이터 가져오기
      res.send({
        response: {
          code: 200,
          response: req.body,
        },
      });
      console.log('--------------------------------------req');
    } catch (error) {
      console.error('updatePageTem error :', error);
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: 'updatePageTem error : 내부 서버 오류가 발생했습니다.',
        timestamp: new Date(),
      });
    }
  },
};
module.exports = siteCtrl;
