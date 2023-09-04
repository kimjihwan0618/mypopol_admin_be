const query = {
  getPageTemList: (param) => {
    return `
    SELECT * FROM popols
    WHERE 1=1
    AND userKey = '${param.userKey}'
    `;
  },
  updatePageTem: (param) => {
    return `
      UPDATE popols
      SET popolName = '${param.popolName}',
      fakeName = '${param.fakeName}',
      email = '${param.email}',
      title = '${param.title}',
      mainColor = '${param.mainColor}',
      profileImg = '${param.profile}',
      thumbnail = '${param.thumbnail}',
      phone = '${param.phone}',
      sns = '${param.snsList}',
      icon = '${param.icon}',
      renewalDate = renewalDate,
      lastUpdated = CURRENT_TIMESTAMP
      WHERE 1=1
      AND userKey = '${param.userKey}'
      AND ptId = '${param.ptId}';
    `;
  },
  addWork: (param) => {
    const { popolSeq, workId, order, title, subTitle, poster, logo, summary, siteList, src } = param
    return `
      INSERT INTO works (popolSeq, workId, ${"`order`"}, title, subTitle, poster, logo, summary, etc, src)
      VALUES (${popolSeq}, ${workId}, ${order}, '${title}', '${subTitle}', '${poster}', '${logo}', '${summary}', '${siteList}', '${src}');
    `
  },
  seletWorkOrder: (param) => {
    return `
    SELECT MAX(${"`order`"}) + 1 AS max_order FROM works
    WHERE popolSeq = ${param.popolSeq}
    AND workId = ${param.workId};
    `;
  },
};

module.exports = query;
