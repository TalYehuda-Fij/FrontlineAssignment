const Email = require("../models/Email")
const User = require("../models/User")

exports.sendEmail = async (req, res, next) => {
    const { from, to, date, subject, body } = req.body    
    if (!from || !to || !subject || !body) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const userFrom = await User.findOne({email: from});
        const userTo =  await User.findOne({email: to});

        if(!userFrom || !userTo){
            return res.status(400).json({ message: "Could not find user from or user to" });
        }

      await Email.create({
        from: userFrom,
        to: userTo,        
        subject,
        body
      }).then(email =>
        res.status(200).json({
          message: "Email successfully sent",
          email,
        })
      )
    } catch (err) {
      res.status(400).json({
        message: "Error sending email",
        error: err.message,
      })
    }
  }

  exports.fetchEmails = async (req, res, next) => {
    const { emailAddress } = req.body;
    if(!emailAddress){
        return res.status(400).json({ message: "Email is requried." });
    }
    try {
        const currentUser = await User.findOne({email: emailAddress});
        
        if(!currentUser){
            return res.status(400).json({ message: "Could not find user from or user to" });
        }

        const emails = await Email.find({
            $or: [{from: currentUser}, {to: currentUser }]            
        })
        .populate("to", "firstname lastname email"  )
        .populate("from", "firstname lastname email" )
        .lean();
                
        return res.status(200).json({ emails });        
    } catch(err) {
        res.status(500).json({
            message: "Error getting emails for user",
            error: err.message,
          })
    }

  }
