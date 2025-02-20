const db = require('../../config/db');  // Make sure your db connection is correctly configured

exports.CheckCustomer = async (req, res) => {
    const { email } = req.body;  // Extract email from the request body

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required.',
        });
    }

    try {
        // Query the database to find the customer with the provided email
        const [customers] = await db.execute('SELECT * FROM customer WHERE email = ?', [email]);

        if (customers.length === 0) {
            // If no customer is found with that email
            return res.json({
                success: false,
                message: 'No customer found with this email.',
            });
        }

        // If customer is found, return the customer data
        return res.status(200).json({
            success: true,
            message: 'Customer found.',
            customerId: customers[0].id,  // assuming the customer table has an 'id' field
        });

    } catch (error) {
        console.error('Error in CheckCustomer:', error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred.',
        });
    }
};
