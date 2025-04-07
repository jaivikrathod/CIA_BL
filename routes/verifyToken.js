const db = require('../config/db');

exports.handleTokenVerification = async (req, res) => {
    const [response] = await db.query('select type,full_name from users where id = ?', [req.headers['x-user-id']]);
    if (response.length == 0) {
        return res.status(401).json({ success: false, message: 'user not found' });
    }
    const { type, full_name } = response[0];

    return res.status(200).json({ success: true, full_name,type, message: 'Token verified successfully.' });
};
