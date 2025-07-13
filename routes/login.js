const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ResponseHandler = require('../utils/responseHandler');

const JWT_SECRET = 'gameover';
const JWT_EXPIRES_IN = '24h';

exports.handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let changePassword = false;
        // Check if email and password are provided
        if (!email || !password) {
            return ResponseHandler.validationError(res, 'Email and password are required.');
        }

        // Fetch user from the database
        const user = await db.users.findOne({ where: { email, is_active: 1 } });
        if (!user) {
            return ResponseHandler.notFound(res, 'User not found.');
        }

        password === "Passwd@123" ? changePassword = true : changePassword = false;

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return ResponseHandler.unauthorized(res, 'Incorrect password.');
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Insert or update token in the database
        await db.tokens.upsert({ user_id: user.id, token });

        // Return success response
        return ResponseHandler.success(res, 200, 'Login successful.', {
            id: user.id,
            token: token,
            full_name: user.full_name,
            type: user.type,
            changePassword
        });

    } catch (err) {
        console.error(err); // Log error for debugging purposes
        return ResponseHandler.error(res, 500, 'An error occurred during login.', err);
    }
};
