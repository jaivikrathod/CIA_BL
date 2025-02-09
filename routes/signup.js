const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.handleSignup = async (req, res) => {
    try {

        const { name, email, mobile, type, password } = req.body;


        const userQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(userQuery, [email], async (err, results) => {
            if (err) {
                return res.status(500).send('Database error.');
            }

            if (results.length > 0) {
                return res.status(400).send('User already exists.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = 'INSERT INTO users (full_name, email, password,type,mobile) VALUES (?, ?, ?,?,?)';
            db.query(insertQuery, [name, email, hashedPassword, type, mobile], (err, result) => {
                if (err) {
                    return res.status(500).send('Failed to create user.');
                }

                return res.status(201).send('Signup successful!');
            });
        });
    } catch (e) {
        return res.status(500).send("other error " + e);
    }

};
