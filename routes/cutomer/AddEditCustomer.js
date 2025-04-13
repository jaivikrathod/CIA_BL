const db = require('../../config/db');

exports.handleAddEditCustomer = async (req, res) => {
    try {
        const { id, full_name, email, primary_mobile, additional_mobile, dob, gender, state, city, full_address } = req.body;

        if (!full_name || !email || !primary_mobile || !gender || !dob || !state || !city || !full_address) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, primary mobile, gender, state, city, and full address are required.'
            });
        }

        const user_id = req.headers['x-user-id'];
        // Check if the email or primary mobile already exists in the database

        const [check] = await db.query(
            'SELECT 1 FROM customer WHERE (email = ? OR primary_mobile = ?) AND id != ? LIMIT 1',
            [email, primary_mobile, id || 0]
        );

        if (check.length > 0) {
            return res.json({
                success: false,
                message: 'Email or primary mobile already exists.'
            });
        }

        let response = '';

        if (!id) {
            response = await db.execute(`
            INSERT INTO customer (user_id,full_name, email, primary_mobile, additional_mobile, dob, gender, state, city,full_address,documents)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `, [user_id, full_name, email, primary_mobile, additional_mobile, dob, gender, state, city, full_address,null]);
        } else {
            response = await db.execute(`
                UPDATE customer SET 
                  full_name = ?, 
                  email = ?, 
                  primary_mobile = ?, 
                  additional_mobile = ?, 
                  dob = ?, 
                  gender = ?, 
                  state = ?, 
                  city = ?, 
                  full_address = ?
                WHERE id = ?
              `, [full_name, email, primary_mobile, additional_mobile, dob, gender, state, city, full_address, id]);
              
        }

        if (response.affectedRows === 0) {
            return res.status(500).json({ success: false, message: 'Failed to add or update customer.' });
        }

        return res.status(200).json({ success: true, message: id ? 'Customer updated successfully.' : 'New customer created successfully.' });

    } catch (error) {
        console.error('Error in handleUpsertCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
