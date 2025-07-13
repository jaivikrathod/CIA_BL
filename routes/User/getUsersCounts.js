const db = require('../../models');

exports.getUsersCounts = async (req, res) => {
    try {
        let count;
        if(req.userType === 'Admin') {
            count = await db.users.count({ where: { is_active: 1 } });
        } else {    
            count = await db.users.count({ where: { id: req.userID, is_active: 1 } });
        }
        return res.status(200).json({ success: true, data: count });
    } catch (error) {
        console.error('Error in listUsers:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
