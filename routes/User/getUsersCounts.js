const db = require('../../config/db');


exports.getUsersCounts = async (req, res) => {
    try {
        let userCounts;
        if(req.userType === 'Admin') {
            [userCounts] = await db.execute('SELECT COUNT(*) AS count FROM users');
        } else {    
            [userCounts] = await db.execute('SELECT COUNT(*) AS count FROM users WHERE id = ?', [req.userID]);
        }
        return res.status(200).json({ success: true, data: userCounts[0].count });
    } catch (error) {
        console.error('Error in listUsers:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
