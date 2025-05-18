const db = require('../../config/db');


exports.getInitialInsuranceStatus = async (req, res) => {
    try{
        const {customer_id} = req.query;
        if (!customer_id) {
            return res.status(400).json({ success: false, message: 'Customer ID is required.' });
        }
        const [response] = await db.execute('SELECT * FROM insurance_common_details WHERE customer_id = ? AND is_active = 1 AND status = 0', [customer_id]);

        if (response.length === 0) {
            return res.status(404).json({ success: false, message: 'No insurance details found.' });
        }

        return res.status(200).json({ success: true, data: response[0] });
    }catch(error){
        console.error('Error in getInitialInsuranceStatus:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}
