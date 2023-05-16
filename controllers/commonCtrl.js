const connection = require('../dbConfig');
const query = require('../query/common');
const url = require('url');

const dbCtrl = {
  getMenus: async (req, res) => {
    const queryObj = url.parse(req.url, true).query;
    const roleId = queryObj.roleId;
    connection.query(query.getMenus(roleId),
      (error, rows) => {
        if (error) throw error;
        if (rows.length === 1) {
          res.send({
            code: 200,
            response: rows[0],
          });
        } else {
          const code = 401;
          res.status(code).json({
            code: code,
            status: 'Unauthorized',
            message: '일치하는 권한이 없습니다.',
            timestamp: new Date(),
          });
        }
      }
    );
  },
  // getMenus
};

module.exports = dbCtrl;
