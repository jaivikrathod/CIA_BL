const db = require('../../config/db'); 


exports.handleDeleteCustomer = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Customer ID is required for deletion.' });
        }

        const updateQuery = 'UPDATE customer SET is_active = 0 WHERE id = ?';
        const [updateResult] = await db.execute(updateQuery, [id]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }

        const response = await db.execute('UPDATE insurance_common_details SET is_active = 0 WHERE customer_id = ?', [id]);
        

        return res.status(200).json({ success: true, message: 'Customer deactivated successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
