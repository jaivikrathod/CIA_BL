const db = require('../../config/db');

exports.handleAddEditCustomer = async (req, res) => {
    try {
        const { id, full_name, email, primary_mobile, additional_mobile, age, gender, state, city, full_address } = req.body;

        if (!full_name || !email || !primary_mobile || !gender || !state || !city || !full_address) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, primary mobile, gender, state, city, and full address are required.'
            });
        }

        const upsertQuery = `
            INSERT INTO customer (id, full_name, email, primary_mobile, additional_mobile, age, gender, state, city, full_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                full_name = VALUES(full_name),
                email = VALUES(email),
                primary_mobile = VALUES(primary_mobile),
                additional_mobile = VALUES(additional_mobile),
                age = VALUES(age),
                gender = VALUES(gender),
                state = VALUES(state),
                city = VALUES(city),
                full_address = VALUES(full_address)
        `;

        await db.execute(upsertQuery, [id || null, full_name, email, primary_mobile, additional_mobile, age, gender, state, city, full_address]);

        return res.status(200).json({ success: true, message: id ? 'Customer updated successfully.' : 'New customer created successfully.' });
        
    } catch (error) {
        console.error('Error in handleUpsertCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
