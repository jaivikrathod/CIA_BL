const db = require('../../models');  
const { v4: uuidv4 } = require('uuid');

exports.CheckCustomer = async (req, res) => {
    const { email } = req.body;  

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required.',
        });
    }

    try {
        const customer = await db.customers.findOne({ where: { email } });

        if (!customer) {
            return res.json({
                success: false,
                message: 'No customer found with this email.',
            });
        }
        return res.json({ success: true, id: customer.id, message: 'Insurance created successfully.' });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred.',
        });
    }
};
