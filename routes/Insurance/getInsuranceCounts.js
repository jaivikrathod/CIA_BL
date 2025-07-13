const db = require('../../models');

exports.getInsuranceCounts = async (req, res) => {
    try {
        let count;
        if(req.userType == 'Admin') {
            count = await db.insurance_common_details.count({ where: { is_active: 1 } });
        } else {
            count = await db.insurance_common_details.count({ where: { user_id: req.userID, is_active: 1 } });
        }
        if (count === 0) {
            return res.status(404).json({ success: false, message: 'No insurance details found.' });
        }
        return res.status(200).json({ success: true, data: count });
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.json({ success: false, message: 'An internal server error occurred.' +error });
    }
};

exports.getInsuranceCounterIntialStep = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.json({ success: false, message: 'Insurance ID is required.' });
        }
        const insurance = await db.insurance_details.findOne({ where: { id }, attributes: ['step'] });
        if (!insurance) {
            return res.json({ success: false, message: 'No insurance details found.' });
        }
        const step = insurance.step;
        return res.json({ success: true, data: step });
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.json({ success: false, message: 'An internal server error occurred.' });
    }
};