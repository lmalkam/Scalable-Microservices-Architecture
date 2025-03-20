const nodeMailer = require("nodemailer")
const dotenv = require("dotenv")

dotenv.config()

const transporter = nodeMailer.createTransport({
    service : "gmail",
    auth:{
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
})

const sendEmail = async(to, subject, text)=>{

    const mailOptions ={
        from: process.env.NODEMAILER_EMAIL,
        to,
        subject,
        text,
    }

    try{
        await transporter.sendMail(mailOptions)
        console.log("Email sent successfully")
    }
    catch(err){
        console.error(err)
    }
}


module.exports = sendEmail