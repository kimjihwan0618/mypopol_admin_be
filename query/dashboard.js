const dashbard = {
  getPopols: (userKey) => {
    return `
    SELECT * FROM popols
    WHERE userKey = '${userKey}'`;
  },
  getWorks: (userKey) => {
    return `
    SELECT * FROM works A
    LEFT OUTER JOIN popols B
    ON 1=1
    AND A.popolSeq = B.popolSeq
    WHERE 1=1
    AND B.userKey = '${userKey}'`;
  },
  getVistors: (userId) => {
    return `
    SELECT * FROM user_daily_visted
    WHERE userId = '${userId}'`;
  },
  getMails: (userId) => {
    return `
    SELECT * FROM mail_sent_count
    WHERE userId = '${userId}'`;
  },
};

module.exports = dashbard;
