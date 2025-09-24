const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.changePass = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ success: false, message: "Old and new passwords are required" });
  }

  try {
    // Fetch user
    const [rows] = await db.execute("SELECT password FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const hashedOldPassword = rows[0].password;

    // Compare old password
    const isMatch = await bcrypt.compare(oldPassword, hashedOldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update DB
    const [result] = await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, id]);

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
