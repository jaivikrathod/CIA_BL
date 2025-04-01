const db = require('../../config/db');


exports.getInsuranceCounts = async (req, res) => {
    try {
        const [InsuranceCounts] = await db.execute('SELECT COUNT(*) AS count FROM insurance_details where is_latest = 1');
        if (InsuranceCounts.length === 0) {
            return res.status(404).json({ success: false, message: 'No insurance details found.' });
        }
        return res.status(200).json({ success: true, data: InsuranceCounts[0].count });
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
