const common = {
  getUser: (params) => {
    return `
      SELECT 
      A.userKey,
      A.userId,
      A.userName,
      A.password,
      B.roleId,
      B.roleName,
      A.authType,
      A.authValue,
      A.profileImg
      FROM users A
      LEFT JOIN roles B
      ON 1=1
      AND A.roleId = B.roleId
      WHERE 1=1
      ${params.hasOwnProperty('userKey') ? `AND userKey = '${params.userKey}'` : ''}
      ${params.hasOwnProperty('userName') ? `AND userName = '${params.userName}'` : ''}
      ${params.hasOwnProperty('hashPassword') ? `AND password = '${params.hashPassword}'` : ''}
      ${params.hasOwnProperty('userId') ? `AND userId = '${params.userId}'` : ''}
      ${params.hasOwnProperty('userEmail') ? `AND authValue = '${params.userEmail}'` : ''}
      ${params.hasOwnProperty('userPhone') ? `AND authValue = '${params.userPhone}'` : ''}
    `;
  },
  postUser: (params) => {
    return `
      INSERT INTO users 
      (userKey, userId, password, userName, roleId, authType, authValue)
      VALUES ('${params.userKey}', 
      '${params.userId}', 
      '${params.hashPassword}', 
      '${params.userName}', 
      2,
      '${params.authType}', 
      '${params.authValue}')
    `;
  },
  postPopol: (params) => {
    return `
      INSERT INTO popols 
      (popolName, fakeName, userKey, ptId, phone, email, title, icon, mainColor, renewalDate, lastUpdated, usedDay, status)
      VALUES ('${params.popolName}', 
      '작가명', 
      '${params.userKey}', 
      '${params.templateId}', 
      '${params.phone}',
      '${params.email}',
      '${params.title}',
      'default',
      'rgb(255, 182, 59)',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP,
      0,
      'Y')
    `;
  },
  updateUserPassword: (params) => {
    return `
      UPDATE users
      SET password = '${params.hashPassword}'
      WHERE 1=1
      AND userId = '${params.userId}'
    `;
  }
}

module.exports = common;