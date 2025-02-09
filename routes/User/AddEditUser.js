const db = require('../../config/db');

exports.handleAddEditUser = async (req, res) => {
    try {
        const { id, full_name, email, mobile, type } = req.body;

        if (!full_name || !email || !mobile || !type) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, mobile, type are required.'
            });
        }

        const upsertQuery = `
            INSERT INTO users (id, full_name, email, mobile,type)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                full_name = VALUES(full_name),
                email = VALUES(email),
                mobile = VALUES(mobile),
                type = VALUES(type)
        `;

        await db.execute(upsertQuery, [id || null, full_name, email, mobile, type]);

        return res.status(200).json({ success: true, message: id ? 'User updated successfully.' : 'New User created successfully.' });
        
    } catch (error) {
        console.error('Error in handleUpsertUser:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
