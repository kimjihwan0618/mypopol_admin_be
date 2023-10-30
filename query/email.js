const email = {
  insertMailCount: (param) => {
    return `
      INSERT INTO mail_sent_count (userId, ptId, email, title, phone, subject, cdate) 
      VALUES ('${param.userId}', '${param.ptId}', '${param.from}', '${param.title}', '${param.phone}', '${param.subject}' , NOW());
  `;
  },
};

module.exports = email;
