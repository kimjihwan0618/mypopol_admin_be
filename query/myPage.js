const query = {
  updateProfileImg: (param) => {
    return `  
      UPDATE users
      SET profileImg = '${param.profileImg}'
      WHERE 1=1
      AND userId = '${param.userId}'
    `;
  },
  updateProfileName: (param) => {
    return `  
      UPDATE users
      SET userName = '${param.username}'
      WHERE 1=1
      AND userId = '${param.userId}'
    `;
  },
  updateProfilePassword: (param) => {
    return `  
      UPDATE users
      SET password = '${param.hashPassword}'
      WHERE 1=1
      AND userId = '${param.userId}'
    `;
  },
};

module.exports = query;
