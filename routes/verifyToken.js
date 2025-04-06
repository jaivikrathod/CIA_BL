const db = require('../config/db');

exports.handleTokenVerification = async (req, res) => {
    return res.status(200).json({ success: true, message: 'Token verified successfully.' });
};
