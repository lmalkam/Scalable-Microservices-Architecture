const express = require("express")
const sendEmail = require("../services/emailService")
const router = express.Router()

router.post("/email", async (req, res) => {
    const {to, subject, text} = req.body

    console.log("uhm")
    try{
        await sendEmail(to,subject,text)
        res.status(200).send("Email sent")
    }
    catch(err){
        res.status(500).send("Failed to send email")
    }
})

module.exports = router