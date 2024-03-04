const site = {
  getPopolInfo: (params) => {
    return `
    SELECT 
    A.popolSeq,
    A.popolName,
    A.fakeName,
    A.userKey,
    A.ptId,
    A.phone,
    A.email,
    A.title,
    A.sns,
    A.icon,
    A.mainColor,
    A.profileImg,
    A.thumbnail,
    DATE_FORMAT(A.renewalDate, '%Y-%m-%d %H:%i:%s') AS renewalDate,
    DATE_FORMAT(A.lastUpdated, '%Y-%m-%d %H:%i:%s') AS lastUpdated,
    A.usedDay,
    A.status,
    A.domain,
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
    SELECT
    workSeq,
    popolSeq,
    workId,
    ${'`order`'},
    title,
    subTitle,
    poster,
    logo,
    summary,
    etc,
    src,
    DATE_FORMAT(lastUpdated, '%Y-%m-%d %H:%i:%s') AS lastUpdated
	  FROM works
    WHERE 1=1
    AND popolSeq = ${popolSeq}
    ORDER BY workId, ${'`order`'}
    `;
  },
  addVisterCount: (params) => {
    return `
      INSERT INTO user_daily_visted (userId, ptId, userIp, timeStamp) 
      VALUES ('${params.userId}', '${params.ptId}', '${params.userIp}' , NOW());
    `;
  },
};

module.exports = site;
