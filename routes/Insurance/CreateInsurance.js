const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

exports.RenewInsurance = async (req, res) => {
    try {
        const [existingData] = await db.query(
            'SELECT * FROM insurance_details WHERE id = ?',
            [req.body.insuraceID]
        );

        if (existingData.length === 0) {
            return res.json({ success: false, message: 'Insurance ID not found.' });
        }

        const dataToInsert = { ...existingData[0] };
        delete dataToInsert.id; 

        const [response] = await db.query(
            'INSERT INTO insurance_details SET ?',
            [dataToInsert]
        );

        const InsertedID = response?.insertId;
        if(InsertedID){    
            return res.json({ success: true,id:InsertedID, message: 'Insurance Renewed successfully.' });
        }else{
            return res.json({ success: false, message: 'Failed to Renew insurance.'});
        }
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

exports.CreateInsurance = async (req, res) => {
    try {
        const common_id = uuidv4();
        const [response] = await db.query('INSERT INTO insurance_details (customer_id, common_id) VALUES(?, ?)', [req.body.customerID,common_id]);
        const InsertedID = response.insertId;
        if(InsertedID){    
            return res.json({ success: true,id:InsertedID, message: 'Insurance created successfully.' });
        }else{
            return res.json({ success: false, message: 'Failed to create insurance.'});
        }
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

