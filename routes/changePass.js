const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.changePass = async (req, res) => {
  const { id } = req.params; // Get user ID from URL
  const { password } = req.body; // Get new password from request body

  if (!password) {
    return res.status(400).json({ success: false, message: "Password is required" });
  }

  try {
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update password in the database
    const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
    const [result] = await db.execute(updateQuery, [hashedPassword, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
