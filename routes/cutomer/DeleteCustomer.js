const db = require('../../models'); 

exports.handleDeleteCustomer = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Customer ID is required for deletion.' });
        }

        const [affectedRows] = await db.customers.update(
            { is_active: 0 },
            { where: { id } }
        );

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Customer not found.' });
        }

        await db.insurance_common_details.update(
            { is_active: 0 },
            { where: { customer_id: id } }
        );

        return res.status(200).json({ success: true, message: 'Customer deactivated successfully.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
