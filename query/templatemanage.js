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
      renewalDate = renewalDate,
      lastUpdated = CURRENT_TIMESTAMP
      WHERE 1=1
      AND userKey = '${param.userKey}'
      AND ptId = '${param.ptId}';
    `;
  },
};

module.exports = query;
