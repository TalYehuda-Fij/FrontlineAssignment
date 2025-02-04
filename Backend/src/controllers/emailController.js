const sendEmail = require("../services/emailService");
const fetchEmails = require("../services/imapService");

const sendTestEmail = async (req, res) => {
    const { email, subject, message } = req.body;
    if (!email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const result = await sendEmail(email, subject, message);
    res.status(result.success ? 200 : 500).json(result); 
};

const getReceivedEmails = async (req, res) => {
    const emails = await fetchEmails();
    res.status(200).json({ emails });
};

module.exports = { sendTestEmail, getReceivedEmails };