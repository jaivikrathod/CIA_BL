const db = require('../../config/db'); 


exports.handleDeleteCustomer = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Customer ID is required for deletion.' });
        }

        const deleteQuery = 'DELETE FROM customer WHERE id = ?';
        const [deleteResult] = await db.execute(deleteQuery, [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }

        return res.status(200).json({ success: true, message: 'Customer deleted successfully.' });
    } catch (error) {
        console.error('Error in handleDeleteCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
