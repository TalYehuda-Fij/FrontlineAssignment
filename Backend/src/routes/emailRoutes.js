const express = require("express");
const router = express.Router();

const { sendTestEmail, getReceivedEmails } = require("../controllers/emailController");

router.route("/send").post(sendTestEmail)
router.route("/receive").get(getReceivedEmails);

module.exports = router;