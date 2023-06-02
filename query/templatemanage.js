const auth = {
  getPageTemList: (param) => {
    return `
    SELECT * FROM popols
    WHERE 1=1
    AND userKey = '${param.userKey}'
    `
  }
}

module.exports = auth;