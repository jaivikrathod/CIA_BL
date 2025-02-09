const db = require('../config/db');

exports.handleTokenVerification = async (req, res) => {
    try {
        const { id, token } = req.body;

        if (!id || !token) {
            return res.json({ success: false, message: 'ID and token are required.' });
        }

        const query = 'SELECT * FROM token WHERE user_id = ?';

        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = results[0];

        if (user.token === token && user.user_id == id) {
            return res.status(200).json({ success: true, message: 'Token verified successfully.' });
        } else {
            return res.status(401).json({ success: false, message: 'Invalid token.' });
        }

    } catch (err) {
        console.error('Error during token verification:', err);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
