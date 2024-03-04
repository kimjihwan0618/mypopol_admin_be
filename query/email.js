const email = {
  insertMailCount: (param) => {
    return `
      INSERT INTO mail_sent_count (userId, ptId, email, title, content, phone, subject, userIp, timeStamp) 
      VALUES ('${param.userId}', '${param.ptId}', '${param.from}', '${param.content}', '${param.title}', '${param.phone}', '${param.subject}', '${param.userIp}' , NOW());
  `;
  },
};

module.exports = email;
