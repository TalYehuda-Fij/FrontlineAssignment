const imaps = require("imap-simple");
const { simpleParser } = require("mailparser");
const imapConfig = require("../config/imap");


const fetchEmails = async () => {
    try {
      const connection = await imaps.connect({ imap: imapConfig.imap });
      await connection.openBox("INBOX");
  
      const searchCriteria = ["UNSEEN"];
      const fetchOptions = { bodies: ["HEADER", "TEXT"], markSeen: true };
  
      const messages = await connection.search(searchCriteria, fetchOptions);
      let emails = [];
  
      for (let item of messages) {
        const all = item.parts.find((part) => part.which === "TEXT");
        const parsedEmail = await simpleParser(all.body);
  
        emails.push({
          from: parsedEmail.from.value[0].address,
          subject: parsedEmail.subject,
          text: parsedEmail.text,
        });
      }
  
      await connection.end();
      return emails;
    } catch (error) {
      console.error("IMAP Error:", error);
      return [];
    }
  };
  
  module.exports = fetchEmails;