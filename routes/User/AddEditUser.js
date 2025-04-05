const db = require('../../config/db');
const bcrypt = require('bcryptjs');

const password = 'Passwd@123';
const saltRounds = 10;


exports.handleAddEditUser = async (req, res) => {
    try {
        const { id, full_name, email, mobile, type } = req.body;

        if (!full_name || !email || !mobile || !type) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email, mobile, type are required.'
            });
        }
        if (id) {
            const updateQuery = `
                    UPDATE users 
                    SET full_name = ?, email = ?, mobile = ?, type = ?
                    WHERE id = ?
                `;
            await db.execute(updateQuery, [full_name, email, mobile, type, id]);

            return res.status(200).json({ success: true, message: 'User updated successfully.' });
        }
        else {
            const checkQuery = `SELECT id FROM users WHERE email = ? OR mobile = ?`;
            const [existingUser] = await db.execute(checkQuery, [email, mobile]);

            if (existingUser.length > 0) {
                return res.json({ success: false, message: 'Email or Mobile number already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const insertQuery = `
            INSERT INTO users (full_name, email, mobile, type, password)
            VALUES (?, ?, ?, ?, ?)`;
            
            await db.execute(insertQuery, [full_name, email, mobile, type,hashedPassword]);

            return res.status(201).json({ success: true, message: 'New user created successfully.' });
        }
    } catch (error) {
        console.error('Error in handleUpsertUser:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    };
}