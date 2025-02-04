const {sendEmail, fetchEmails} = require("../services/emailService");

const sendEmailAsync = async (req, res) => {
    const { from, to, date, subject, body } = req.body;
    if (!from || !to || !subject || !body) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const result = await sendEmail(req, res);
    res.status(result ? 200 : 500).json(result); 
};

const getEmailsForUser = async (req, res) => {   
    return await fetchEmails(req, res);
};

module.exports = { sendEmailAsync, getEmailsForUser };