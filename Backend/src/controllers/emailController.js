const sendEmail = require("../services/emailService");


const sendTestEmail = async (req, res) => {
    const { email, subject, message } = req.body;
    if (!email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const result = await sendEmail(email, subject, message);
    res.status(result.success ? 200 : 500).json(result); 
};

module.exports = {sendTestEmail};