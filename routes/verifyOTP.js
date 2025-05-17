const db = require('../config/db');
const env = require('dotenv').config();

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    try {
        const [result] = await db.query(
            `SELECT otp.*, users.id 
             FROM otp 
             JOIN users ON users.email = otp.email 
             WHERE otp.email = ? AND otp.otp = ?`,
            [email, otp]
        );

        if (!result || result.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid OTP or email.' });
        }

        const validTill = new Date(result[0].valid_till);
        if (validTill < new Date()) {
            return res.status(400).json({ success: false, message: 'OTP has expired.' });
        }

        await db.query('DELETE FROM otp WHERE email = ?', [email]);

        return res.status(200).json({ success: true, id: result[0].id, message: 'OTP verified successfully.' });

    } catch (error) {
        console.error("verifyOTP Error:", error);
        return res.status(500).json({ success: false, message: 'An internal error occurred.', error: error.message });
    }
}
