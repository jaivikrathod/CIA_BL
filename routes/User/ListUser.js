const db = require('../../config/db'); 


exports.listUsers = async (req, res) => {
    try {
        const [Users] = await db.execute('SELECT * FROM users where id != ?',[req.userID]);
        return res.status(200).json({ success: true, data: Users });
    } catch (error) {
        console.error('Error in listUsers:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
