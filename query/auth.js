const auth = {
  getUser: (params) => {
    return `
      SELECT 
      A.userKey,
      A.userId,
      A.userName,
      B.roleId,
      B.roleName
      FROM users A
      LEFT JOIN roles B
      ON 1=1
      AND A.roleId = B.roleId
      WHERE 1=1
      ${params.hasOwnProperty('userKey') ? `AND userKey = '${params.userKey}'` : ""}
      ${params.hasOwnProperty('password') ? `AND password = '${params.password}'` : ""}
      AND userId = '${params.userId}'
    `
  },
  postUser: (params) => {
    return `
      INSERT INTO users 
      (userKey, userId, password, userName, roleId)
      VALUES ('${params.userKey}', '${params.userId}', '${params.password}', '${params.userName}', 1)
    `
  },
  postPopol: (params) => {
    return `
      INSERT INTO popols 
      (popolName, userKey, ptId, phone, email, title, icon, mainColor, usedDay, status)
      VALUES ('${params.popolName}', 
      '${params.userKey}', 
      '${params.templateId}', 
      '010-0000-0000',
      'wlghks0106@naver.com',
      '${params.title}',
      'bite',
      'rgb(255, 182, 59)',
      0,
      'Y'
      )
    `
  },
}

module.exports = auth;