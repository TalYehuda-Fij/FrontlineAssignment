const {sendEmail, fetchEmails} = require("../services/emailService");

const sendEmailAsync = async (req, res) => {
    const { from, to, date, subject, body } = req.body;
    if (!from || !to || !subject || !body) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const result = await sendEmail(req, res);
    res.status(result.status == 200? 200 : 500).json(result); 
};

const getEmailsForUser = async (req, res) => {   
    const emails = await fetchEmails(req, res);
    res.status(200).json({ emails });
};

module.exports = { sendEmailAsync, getEmailsForUser };