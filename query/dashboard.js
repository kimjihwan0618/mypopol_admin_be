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
    SELECT 
    -- (@rownum := @rownum + 1) AS row_number,
    A.*,
    B.popolName,
    B.popolSeq
    FROM user_daily_visted A
    LEFT OUTER JOIN popols B
    ON 1=1
    AND A.ptId = B.ptId
    LEFT OUTER JOIN users C
    ON 1=1
    AND B.userKey = C.userKey
    -- JOIN
    -- (SELECT @rownum := 0) r
    WHERE 1=1
    AND A.userId = '${userId}'
    AND C.userId = '${userId}'
    `;
  },
  getMails: (userId) => {
    return `
    SELECT 
    -- (@rownum := @rownum + 1) AS row_number,
    A.*,
    B.popolName,
    B.popolSeq
    FROM mail_sent_count A
    LEFT OUTER JOIN popols B
    ON 1=1
    AND A.ptId = B.ptId
    LEFT OUTER JOIN users C
    ON 1=1
    AND B.userKey = C.userKey
    -- JOIN
    -- (SELECT @rownum := 0) r
    WHERE 1=1
    AND A.userId = '${userId}'
    AND C.userId = '${userId}'
    `;
  },
};

module.exports = dashbard;
