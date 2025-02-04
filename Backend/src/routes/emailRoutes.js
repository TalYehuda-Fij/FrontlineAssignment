const express = require("express");
const router = express.Router();

const { sendTestEmail } = require("../controllers/emailController");

router.route("/send").post(sendTestEmail)

module.exports = router;