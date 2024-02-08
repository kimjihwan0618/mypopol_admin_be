const auth = {
  getMenus: (roleId) => {
    return `
    SELECT menuJson FROM roles
    WHERE 1=1
    AND roleId = '${roleId}'
  `},
};

module.exports = auth;
