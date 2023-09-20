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
  seletLastWorkSeq: () => {
    return `
    SELECT MAX(workSeq) AS last_work_seq
    FROM works;
    `;
  },
  seletWorkOrder: (param) => {
    return `
    SELECT MAX(${"`order`"}) + 1 AS max_order FROM works
    WHERE popolSeq = ${param.popolSeq}
    AND workId = ${param.workId};
    `;
  },
  updateWork: (param) => {
    return `  
      UPDATE works
      SET title = '${param.title}',
      subTitle = '${param.subTitle}',
      poster = '${param.poster}',
      logo = '${param.logo}',
      summary = '${param.summary}',
      etc = '${param.siteList}'
      WHERE 1=1
      AND popolSeq = ${param.popolSeq}
      AND workSeq = ${param.workSeq}
    `;
  },
  updateWorkSeq: (param) => {
    return `  
      UPDATE works SET workSeq = workSeq - 1 
      WHERE workSeq <= ${param.lastWorkSeq}
      AND workSeq > ${param.workSeq};
    `;
  },
  updateWorkOrder: (param) => {
    return `  
      UPDATE works SET ${"`order`"} = ${"`order`"} - 1 
      WHERE popolSeq = ${param.popolSeq}
      AND ${"`order`"} > ${param.order};
    `;
  },
  updateWorkOrder2: (work, index) => {
    return `  
      UPDATE works SET ${"`order`"} = ${index} 
      WHERE popolSeq = ${work.popolSeq}
      AND workSeq = ${work.workSeq}
      AND workId = ${work.workId}
    `;
  },
  seqWorkSeq: (param) => {
    return `  
      ALTER TABLE works AUTO_INCREMENT = ${param.lastWorkSeq};
    `;
  },
  deleteWork: (param) => {
    return `
      DELETE FROM works
      WHERE 1=1
      AND workSeq = ${param.workSeq}
      AND src = '${param.src}'
    `
  }
};

module.exports = query;
