const db = require('../../config/db'); 


exports.handleDeleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'User ID is required for deletion.' });
        }

        const updateQuery = 'UPDATE users SET is_active = 0 WHERE id = ?';
        const [updateResult] = await db.execute(updateQuery, [id]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({ success: true, message: 'User deactivated successfully.' });
    } catch (error) {
        console.error('Error in handleDeleteUser:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
