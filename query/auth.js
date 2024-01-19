const auth = {
  getUser: (param) => {
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
      ${param.hasOwnProperty('userKey') ? `AND userKey = '${param.userKey}'` : ""}
      ${param.hasOwnProperty('password') ? `AND password = '${param.password}'` : ""}
      AND userId = '${param.userId}'
    `
  }
}

module.exports = auth;