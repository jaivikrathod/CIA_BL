const { users } = require('../models');
const bcrypt = require('bcryptjs');

exports.forgetChangePass = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [affectedRows] = await users.update(
            { password: hashedPassword },
            { where: { id } }
        );

        if (affectedRows === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

