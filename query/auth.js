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
      AND userKey = '${param.userKey}'
      AND userId = '${param.userId}'
      AND password = '${param.password}'
    `
  }
}

module.exports = auth;