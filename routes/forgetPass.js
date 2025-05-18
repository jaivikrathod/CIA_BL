const db = require('../config/db');
const env = require('dotenv').config();
const nodemailer = require('nodemailer');

exports.forgetPass = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required.' });
        }

        const [response] = await db.query('SELECT 1 FROM users WHERE email = ? LIMIT 1', [email]);

        if (!response || response.length === 0) {
            return res.status(404).json({ success: false, message: 'Email not found.' });
        }

        const emailResult = await sendEmailOtp(email);

        if (!emailResult.success) {
            return res.status(500).json({ success: false, message: emailResult.message });
        }

        return res.status(200).json({ success: true, message: 'OTP sent to your email.' });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'An internal error occurred.', error: err.message });
    }
}

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

async function sendEmailOtp(reciverEmail) {
    try {
        const otp = generateOtp();
        const validTill = new Date(Date.now() + 5 * 60 * 1000);

        const [response] = await db.query(
            `INSERT INTO otp (email, otp, valid_till) 
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE 
             otp = VALUES(otp), 
            valid_till = VALUES(valid_till)`,
            [reciverEmail, otp, validTill]
        );


        if (!response || response.affectedRows === 0) {
            return { success: false, message: 'Failed to save OTP to database.' };
        }

        let transporter;
        try {
            transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: env.parsed?.GOOGLE_APP_GMAIL,
                    pass: env.parsed?.GOOGLE_APP_PASSWORD,
                },
            });
        } catch (transportError) {
            return { success: false, message: 'Failed to create email transporter.' };
        }

        const mailOptions = {
            from: 'yoyo@gmail.com',
            to: reciverEmail,
            subject: 'Your OTP Code',
            text: `Your OTP code for is ${otp}. It is valid for 5 minutes.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            return { success: true };
        } catch (mailError) {
            return { success: false, message: 'Failed to send OTP email.' };
        }

    } catch (err) {
        return { success: false, message: 'An unexpected error occurred while sending OTP.' };
    }
}