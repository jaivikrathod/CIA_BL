const db = require('./config/db');

exports.validateUser = async (req, res, next) => {
    const token = req.headers['authorization'];
    const userId = req.headers['x-user-id'];
    
    if (!token || !userId) {
        return res.json({ success: false, message: 'Authorization token and user ID are required.' });
    }

    try {
        const [rows] = await db.query('SELECT * FROM token WHERE user_id = ? AND token = ?', [userId, token]);
        if (rows.length == 0) {
            return res.json({ success: false, message: 'Invalid token or user ID.' });
        }

        const [userRows] = await db.query('SELECT type FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: 'User not found.' });
        }
        
        req.userType = userRows[0].type;
        req.userID = userId;
        
        next();
    } catch (err) {
        return res.json({ success: false, message: 'An internal server error occurred.' });
    }
    
}