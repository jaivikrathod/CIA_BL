const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const ResponseHandler = require('../../utils/responseHandler');

const password = 'Password@123';
const saltRounds = 10;


exports.handleAddEditUser = async (req, res) => {
    try {
        const { id, full_name, email, mobile, type } = req.body;

        if (!full_name || !email || !mobile || !type) {
            return ResponseHandler.validationError(res, 'Full name, email, mobile, type are required.');
        }
        if (id) {
            const updateQuery = `
                    UPDATE users 
                    SET full_name = ?, email = ?, mobile = ?, type = ?
                    WHERE id = ?
                `;
            await db.execute(updateQuery, [full_name, email, mobile, type, id]);

            return ResponseHandler.updated(res, 'User updated successfully.');
        }
        else {
            const checkQuery = `SELECT id FROM users WHERE email = ? OR mobile = ?`;
            const [existingUser] = await db.execute(checkQuery, [email, mobile]);

            if (existingUser.length > 0) {
                return ResponseHandler.conflict(res, 'Email or Mobile number already exists.');
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const insertQuery = `
            INSERT INTO users (full_name, email, mobile, type, password)
            VALUES (?, ?, ?, ?, ?)`;
            
            await db.execute(insertQuery, [full_name, email, mobile, type,hashedPassword]);

            return ResponseHandler.created(res, 'New user created successfully.');
        }
    } catch (error) {
        console.error('Error in handleUpsertUser:', error);
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    };
}