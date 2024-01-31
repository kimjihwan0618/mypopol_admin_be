const site = {
  getPopolInfo: (params) => {
    return `
    SELECT 
    A.* ,
    B.userId
    FROM popols A
    LEFT JOIN users B
    ON 1=1
    AND A.userKey = B.userKey
    WHERE 1=1
    AND B.userId = '${params.userId}'
    AND A.ptId = '${params.ptId}'
  `;
  },
  getWorks: (popolSeq) => {
    return `
    SELECT * FROM works
    WHERE 1=1
    AND popolSeq = ${popolSeq}
    ORDER BY workId, ${"`order`"}
    `
  },
  addVisterCount: (params) => {
    return `
      INSERT INTO user_daily_visted (userId, ptId, userIp, vistedTime) 
      VALUES ('${params.userId}', '${params.ptId}', '${params.userIp}' , NOW());
    `
  }
};

module.exports = site;
