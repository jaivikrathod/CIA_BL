const db = require('../../config/db');
const ResponseHandler = require('../../utils/responseHandler');

exports.handleAddEditCustomer = async (req, res) => {
    try {
        const { id, full_name, email, primary_mobile, additional_mobile, dob, gender, state, city, full_address } = req.body;

        if (!full_name || !email || !primary_mobile || !gender || !dob || !state || !city || !full_address) {
            return ResponseHandler.validationError(res, 'Full name, email, primary mobile, gender, state, city, and full address are required.');
        }

        const user_id = req.headers['x-user-id'];
        // Check if the email or primary mobile already exists in the database

        const [check] = await db.query(
            'SELECT 1 FROM customer WHERE (email = ? OR primary_mobile = ?) AND id != ? LIMIT 1',
            [email, primary_mobile, id || 0]
        );

        if (check.length > 0) {
            return ResponseHandler.conflict(res, 'Email or primary mobile already exists.');
        }

        let response = '';

        if (!id) {
            response = await db.execute(`
            INSERT INTO customer (user_id,full_name, email, primary_mobile, additional_mobile, dob, gender, state, city,full_address,documents)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `, [user_id, full_name, email, primary_mobile, additional_mobile, dob, gender, state, city, full_address,'']);
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
            return ResponseHandler.error(res, 500, 'Failed to add or update customer.');
        }

        return id ? ResponseHandler.updated(res, 'Customer updated successfully.') : ResponseHandler.created(res, 'New customer created successfully.');

    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};

