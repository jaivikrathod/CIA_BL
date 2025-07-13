const db = require('../../models');

exports.getInitialInsuranceStatus = async (req, res) => {
    try {
        const { customer_id } = req.query;
        if (!customer_id) {
            return res.status(400).json({ success: false, message: 'Customer ID is required.' });
        }
        const response = await db.insurance_common_details.findOne({
            where: {
                customer_id,
                is_active: 1,
                status: 0
            }
        });

        if (!response) {
            return res.status(404).json({ success: false, message: 'No insurance details found.' });
        }

        return res.status(200).json({ success: true, data: response });
    } catch (error) {
        console.error('Error in getInitialInsuranceStatus:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}
