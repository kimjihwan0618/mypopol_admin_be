const site = {
  getPopolInfo: (param) => {
    return `
    SELECT 
    A.* ,
    B.userId
    FROM popols A
    LEFT JOIN users B
    ON 1=1
    AND A.userKey = B.userKey
    WHERE 1=1
    AND B.userId = '${param.userId}'
    AND A.ptId = '${param.ptId}'
  `;
  },
  getWorks: (popolSeq) => {
    return `
    SELECT * FROM works
    WHERE 1=1
    AND popolSeq = ${popolSeq}
    `
  }
};

module.exports = site;
