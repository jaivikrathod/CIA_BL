const { response } = require('express');
const db = require('../../config/db');
const ResponseHandler = require('../../utils/responseHandler');

exports.handleAddEditAgent = async (req, res) => {
    try {
        const { id, full_name, email, primary_mobile } = req.body;

        if (!full_name || !email || !primary_mobile) {
            return ResponseHandler.validationError(res, 'Full name, email and primary mobile required.');
        }

        // const user_id = req.headers['x-user-id'];
        // Check if the email or primary mobile already exists in the database

        const [check] = await db.query(
            'SELECT 1 FROM agents WHERE (email = ? OR primary_mobile = ?) AND id != ? LIMIT 1',
            [email, primary_mobile, id || 0]
        );

        if (check.length > 0) {
            return ResponseHandler.conflict(res, 'Email or primary mobile already exists.');
        }

        let response = '';

        if (!id) {
            response = await db.execute(`
            INSERT INTO agents (full_name, email, primary_mobile,user_id)
            VALUES (?, ?, ?,?)
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
            return ResponseHandler.error(res, 500, 'Failed to add or update agent.');
        }

        return id ? ResponseHandler.updated(res, 'Agent updated successfully.') : ResponseHandler.created(res, 'New agent created successfully.');

    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};


exports.listAgents = async (req, res) => {
    try{
        let response;
        if(req.userType == 'Admin'){
            [response] = await db.execute('SELECT * FROM agents where is_active = 1');
        }else{
            [response] = await db.execute('SELECT * FROM agents where user_id = ? AND is_active = 1',[req.userID]);
        }
        
        if (response.length === 0) {
            return res.status(404).json({ success: false, message: 'No agents found.' });
        }
        return res.status(200).json({ success: true, data: response });
    }catch(error){
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
}

exports.handleDeleteAgent = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Agent ID is required.' });
        }
        const [response] = await db.execute('UPDATE agents SET is_active = 0 WHERE id = ?', [id]);
        if (response.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Agent not found.' });
        }
        return res.status(200).json({ success: true, message: 'Agent deactivated successfully.' });
    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
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
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
}

