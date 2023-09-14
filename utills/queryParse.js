const queryParse = {
  singleQuiteParse: (param) => {
    const keys = Object.keys(param);
    for (let i = 0; i < keys.length; i++) {
      if (String(param[keys[i]]).includes("'")) {
        param[keys[i]] = param[keys[i]].replaceAll("'", "''");
      }
    }
    return param;
  }
}

module.exports = queryParse;