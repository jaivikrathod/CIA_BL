const db = require('../../models');
const { v4: uuidv4 } = require('uuid');

exports.CheckCustomer = async (req, res) => {
    const { email } = req.body;  // can be email or mobile

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email or mobile is required.',
        });
    }

    try {
        // Check whether identifier is an email or mobile
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isMobile = /^[0-9]{10}$/.test(email); // adjust regex as per your format

        let customer;

        if (isEmail) {
            customer = await db.customers.findOne({ where: { email: email } });
        } else if (isMobile) {
            customer = await db.customers.findOne({ where: { primary_mobile: email } });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or mobile format.',
            });
        }

        if (!customer) {
            return res.json({
                success: false,
                message: 'No customer found with this email or mobile.',
            });
        }

        return res.json({
            success: true,
            id: customer.id,
            message: 'Insurance created successfully.'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred.',
        });
    }
};
