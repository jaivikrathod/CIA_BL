const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'gameover';
const JWT_EXPIRES_IN = '24h';

exports.handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        // Fetch user from the database
        const query = 'SELECT * FROM users WHERE email = ?';
        const [results] = await db.query(query, [email]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const user = results[0];

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
            token: token
        });

    } catch (err) {
        console.error(err); // Log error for debugging purposes
        return res.status(500).json({ success: true, message: 'An error occurred during login.', error: err.message });
    }
};
