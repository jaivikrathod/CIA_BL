const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'gameover';
const JWT_EXPIRES_IN = '24h';

exports.handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        let changePassword = false;
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Fetch user from the database
        const query = 'SELECT * FROM users WHERE email = ? AND is_active = 1';
        const [results] = await db.query(query, [email]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = results[0];

        password === "Passwd@123" ? changePassword = true : changePassword = false; 

        // Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Incorrect password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Insert or update token in the database
        const insertOrUpdateTokenQuery = `
            INSERT INTO token (user_id, token)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE token = VALUES(token)
        `;

        await db.query(insertOrUpdateTokenQuery, [user.id, token]);

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            id: user.id,
            token: token,
            full_name: user.full_name,
            type: user.type,
            changePassword
        });

    } catch (err) {
        console.error(err); // Log error for debugging purposes
        return res.status(500).json({ success: false, message: 'An error occurred during login.', error: err });
    }
};
