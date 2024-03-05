const query = {
  updateProfileImg: (param) => {
    return `  
      UPDATE users
      SET profileImg = '${param.profileImg}'
      WHERE 1=1
      AND userId = '${param.userId}'
    `;
  },
};

module.exports = query;
