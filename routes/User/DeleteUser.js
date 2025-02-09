const db = require('../../config/db'); 


exports.handleDeleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'User ID is required for deletion.' });
        }

        const deleteQuery = 'DELETE FROM users WHERE id = ?';
        const [deleteResult] = await db.execute(deleteQuery, [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        return res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error in handleDeleteUser:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
