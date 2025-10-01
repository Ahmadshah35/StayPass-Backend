const nodemailer = require("nodemailer");
require("dotenv").config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth:{
        user: process.env.appEmail,
        pass: process.env.appPassword
    }
});

const sendOTP = async (userData) => {
    try {
        let mailOptions = {
            from: process.env.appEmail,
            to: userData.email,
            subject: "Your OTP Code",
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Welcome to Staypass!</h2>
                <p>Your One-Time  (OTP) is:</p>
                <h1 style="color: #1AAED1;">${userData.otp}</h1>
                <p>Please enter this code in the app to verify your account.</p>
                <p><strong>Note:</strong>  Do not share it with anyone.</p>
                <br/>
                <p>Thank you,<br/>Team Staypass</p>
              </div>
            `,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Email Sent :", info.response);
        return true
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    };
};


module.exports = {
    sendOTP
};
