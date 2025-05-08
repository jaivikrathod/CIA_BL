const { response } = require('express');
const db = require('../../config/db');

exports.handleAddEditAgent = async (req, res) => {
    try {
        const { id, full_name, email, primary_mobile } = req.body;

        if (!full_name || !email || !primary_mobile) {
            return res.status(400).json({
                success: false,
                message: 'Full name, email and primary mobile required.'
            });
        }

        // const user_id = req.headers['x-user-id'];
        // Check if the email or primary mobile already exists in the database

        const [check] = await db.query(
            'SELECT 1 FROM agents WHERE (email = ? OR primary_mobile = ?) AND id != ? LIMIT 1',
            [email, primary_mobile, id || 0]
        );

        if (check.length > 0) {
            return res.json({
                success: false,
                message: 'Email or primary mobile already exists.'
            });
        }

        let response = '';

        if (!id) {
            response = await db.execute(`
            INSERT INTO agents (full_name, email, primary_mobile,user_id)
            VALUES (?, ?, ?)
        `, [ full_name, email, primary_mobile,req.userID]);
        } else {
            response = await db.execute(`
                UPDATE agents SET 
                  full_name = ?, 
                  email = ?, 
                  primary_mobile = ?
                  user_id = ?
                WHERE id = ?
              `, [full_name, email, primary_mobile,req.userID, id]);
              
        }

        
        if (response.affectedRows === 0) {
            return res.status(500).json({ success: false, message: 'Failed to add or update customer.' });
        }

        return res.status(200).json({ success: true, message: id ? 'Customer updated successfully.' : 'New customer created successfully.', data: response });

    } catch (error) {
        console.error('Error in handleUpsertCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};


exports.listAgents = async (req, res) => {
    try{
        let response;
        if(req.userType == 'Admin'){
            [response] = await db.execute('SELECT * FROM agents');
        }else{
            [response] = await db.execute('SELECT * FROM agents where user_id = ?',[req.userID]);
        }
        
        if (response.length === 0) {
            return res.status(404).json({ success: false, message: 'No agents found.' });
        }
        return res.status(200).json({ success: true, data: response });
    }catch(error){
        console.error('Error in handleUpsertCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}

exports.handleDeleteAgent = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Agent ID is required.' });
    }
    const [response] = await db.execute('DELETE FROM agents WHERE id = ?', [id]);
    if (response.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Agent not found.' });
    }
    return res.status(200).json({ success: true, message: 'Agent deleted successfully.' });
} catch (error) {
        console.error('Error in handleDeleteAgent:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}

exports.agentscount = async (req,res)=>{
    try{
        let response;
        if(req.userType == 'Admin'){
            [response] = await db.execute('SELECT COUNT(*) AS count FROM agents');
        }else{
            [response] = await db.execute('SELECT COUNT(*) AS count FROM agents where user_id = ?',[req.userID]);
        }
        
        if (response.length === 0) {
            return res.status(404).json({ success: false, message: 'No agents found.' });
        }
        return res.status(200).json({ success: true, data: response[0].count });
    }catch(error){
        console.error('Error in handleUpsertCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}

