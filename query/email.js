const email = {
  insertMailCount: (param) => {
    return `
      INSERT INTO mail_sent_count (userId, ptId, email, title, phone, subject, userIp, cdate) 
      VALUES ('${param.userId}', '${param.ptId}', '${param.from}', '${param.title}', '${param.phone}', '${param.phone}', '${param.userIp}' , NOW());
  `;
  },
};

module.exports = email;
