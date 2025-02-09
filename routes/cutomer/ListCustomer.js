const db = require('../../config/db'); 


exports.listCustomers = async (req, res) => {
    try {
        const [customers] = await db.execute('SELECT * FROM customer');
        return res.status(200).json({ success: true, data: customers });
    } catch (error) {
        console.error('Error in listCustomers:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
