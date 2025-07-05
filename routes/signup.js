const db = require('../config/db');
const bcrypt = require('bcryptjs');
const ResponseHandler = require('../utils/responseHandler');

exports.handleSignup = async (req, res) => {
    try {

        const { name, email, mobile, type, password } = req.body;


        const userQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(userQuery, [email], async (err, results) => {
            if (err) {
                return ResponseHandler.error(res, 500, 'Database error.', err);
            }

            if (results.length > 0) {
                return ResponseHandler.conflict(res, 'User already exists.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = 'INSERT INTO users (full_name, email, password,type,mobile) VALUES (?, ?, ?,?,?)';
            db.query(insertQuery, [name, email, hashedPassword, type, mobile], (err, result) => {
                if (err) {
                    return ResponseHandler.error(res, 500, 'Failed to create user.', err);
                }

                return ResponseHandler.created(res, 'Signup successful!');
            });
        });
    } catch (e) {
        return ResponseHandler.error(res, 500, 'An error occurred during signup.', e);
    }

};
