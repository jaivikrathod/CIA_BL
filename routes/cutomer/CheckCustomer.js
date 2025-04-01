const db = require('../../config/db');  
const { v4: uuidv4 } = require('uuid');

exports.CheckCustomer = async (req, res) => {
    const { email } = req.body;  

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required.',
        });
    }

    try {
        const [customers] = await db.execute('SELECT * FROM customer WHERE email = ?', [email]);

        if (customers.length === 0) {
            return res.json({
                success: false,
                message: 'No customer found with this email.',
            });
        }
        try {
            const common_id = uuidv4();
            const [response] = await db.query('INSERT INTO insurance_details (customer_id, common_id,is_latest) VALUES(?, ?,1)', [customers[0].id,common_id]);
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

    } catch (error) {
        console.error('Error in CheckCustomer:', error);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred.',
        });
    }
};
