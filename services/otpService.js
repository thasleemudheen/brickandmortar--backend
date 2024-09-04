const nodemailer = require('nodemailer');
 // Import your User model
require('dotenv').config()
const otpService = {
    otpMap: new Map(),

    generateOTP: function () {
        return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    },

    sendOTP: async function (email, otp) {
        try {
            const transporter = nodemailer.createTransport({
                service:process.env.EMAIL_SERVICE,
                auth: {
                    user:process.env.EMAIL_ADDRESS, // Your Gmail email address
                    pass: process.env.APP_PASSWORD // Your Gmail password
                }
            });

            const mailOptions = {
                from:process.env.EMAIL_ADDRESS,
                to: email,
                subject: 'Login OTP',
                text:`Your OTP for login is:${otp}`
            };

            await transporter.sendMail(mailOptions);
            console.log('OTP sent successfully.');
        } catch (error) {
            console.error('Error sending OTP:', error);
            throw new Error('Error sending OTP. Please try again.');
        }
    },
};

module.exports = otpService;