const db = require('../../config/db'); 


exports.listUsers = async (req, res) => {
    try {
        const [Users] = await db.execute('SELECT * FROM users where id != ? AND is_active',[req.userID,1]);
        return res.status(200).json({ success: true, data: Users });
    } catch (error) {
        console.error('Error in listUsers:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

exports.getParticularUserDetails = async (req, res) => {
  try{
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const [userDetails] = await db.execute('SELECT * FROM users WHERE id = ?', [user_id]);

    if (userDetails.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, data: userDetails[0] });

  }catch(error){
    console.error('Error in getParticularUserDetails:', error);
    return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
  }
}

exports.updateParticularUserDetails = async (req, res) => { 
    try{
        const {id, full_name, email, mobile} = req.body;

        if (!id ||  !full_name || !email || !mobile) {
            return res.status(400).json({ success: false, message: 'full name, email and mobile are required.' });
        }

        const updateQuery = `
            UPDATE users 
            SET full_name = ?, email = ?, mobile = ?
            WHERE id = ?
        `;

        const [response] = await db.execute(updateQuery, [full_name, email, mobile, id]);

        if(response.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        
        return res.status(200).json({ success: true, message: 'User details updated successfully.' });
          
    }catch(error){
        console.error('Error in updateParticularUserDetails:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}