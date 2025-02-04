const express = require("express");
const router = express.Router();

const { sendEmailAsync, getEmailsForUser } = require("../controllers/emailController");

router.route("/send").post(sendEmailAsync)
router.route("/fetch-emails").post(getEmailsForUser);

module.exports = router;