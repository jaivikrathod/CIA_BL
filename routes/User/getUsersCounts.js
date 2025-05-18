const db = require('../../config/db');


exports.getUsersCounts = async (req, res) => {
    try {
        let userCounts;
        if(req.userType === 'Admin') {
            [userCounts] = await db.execute('SELECT COUNT(*) AS count FROM users WHERE is_active = 1');
        } else {    
            [userCounts] = await db.execute('SELECT COUNT(*) AS count FROM users WHERE id = ? AND is_active=1', [req.userID]);
        }
        return res.status(200).json({ success: true, data: userCounts[0].count });
    } catch (error) {
        console.error('Error in listUsers:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
