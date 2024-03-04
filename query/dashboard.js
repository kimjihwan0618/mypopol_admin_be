const dashbard = {
  getPopols: (userKey) => {
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
    DATE_FORMAT(A.lastUpdated, '%Y-%m-%d %H:%i:%s') AS lastUpdated,
    DATE_FORMAT(A.renewalDate, '%Y-%m-%d %H:%i:%s') AS renewalDate,
    A.usedDay,
    A.status,
    A.domain,
    B.description,
    C.userId
    FROM popols AS A
    LEFT OUTER JOIN popol_info AS B
    ON 1=1
    AND A.ptId = B.ptId
    LEFT OUTER JOIN users AS C
    ON 1=1
    AND A.userKey = C.userKey
    WHERE 1=1
    AND A.userKey = '${userKey}'
    `;
  },
  getWorks: (userKey) => {
    return `
    SELECT 
    A.workSeq,
    A.popolSeq,
    A.workId,
    A.order,
    A.title,
    A.subTitle,
    A.poster,
    A.logo,
    A.summary,
    A.etc,
    A.src,
    DATE_FORMAT(A.lastUpdated, '%Y-%m-%d %H:%i:%s') AS lastUpdated
    FROM works A
    LEFT OUTER JOIN popols B
    ON 1=1
    AND A.popolSeq = B.popolSeq
    WHERE 1=1
    AND B.userKey = '${userKey}'
	 `;
  },
  getVistors: (userId) => {
    return `
    SELECT 
    A.countSeq,
    A.userId,
    A.ptId,
    A.userIp,
    DATE_FORMAT(A.timeStamp, '%Y-%m-%d %H:%i:%s') AS timeStamp,
    B.popolName,
    B.popolSeq
    FROM user_daily_visted A
    LEFT OUTER JOIN popols B
    ON 1=1
    AND A.ptId = B.ptId
    LEFT OUTER JOIN users C
    ON 1=1
    AND B.userKey = C.userKey
    WHERE 1=1
    AND A.userId = '${userId}'
    AND C.userId = '${userId}'
    `;
  },
  getMails: (userId) => {
    return `
    SELECT 
    A.seq,
    A.userId,
    A.ptId,
    A.email,
    A.title,
    A.content,
    A.phone,
    A.subject,
    A.userIp,
    DATE_FORMAT(A.timeStamp, '%Y-%m-%d %H:%i:%s') AS timeStamp,
    B.popolName,
    B.popolSeq
    FROM mail_sent_count A
    LEFT OUTER JOIN popols B
    ON 1=1
    AND A.ptId = B.ptId
    LEFT OUTER JOIN users C
    ON 1=1
    AND B.userKey = C.userKey
    WHERE 1=1
    AND A.userId = '${userId}'
    AND C.userId = '${userId}'
    `;
  },
};

module.exports = dashbard;
