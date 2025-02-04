const transporter = require("../config/mailer");

const sendEmail = async (to, subject, text) => { 
    try { 
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
            return { 
            success: true, message: "Email sent successfully" }; 
    } catch (error) {
        console.error("Email error:", error);
        return {
         success: false, message: "Email failed to send", error }; 
    } 
}; 

module.exports = sendEmail;