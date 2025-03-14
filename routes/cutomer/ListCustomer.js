const db = require('../../config/db'); 


exports.listCustomers = async (req, res) => {
    try {
        const [customers] = await db.execute('SELECT * FROM customer');
        if(customers.length === 0) {
            return res.status(200).json({ success: true, message: 'No customers found.' });
        }
        customers.forEach(customer => {
            const dob = new Date(customer.dob);
            const diff = Date.now() - dob.getTime();
            const ageDate = new Date(diff); 
            customer.age = Math.abs(ageDate.getUTCFullYear() - 1970);
        });
        return res.status(200).json({ success: true, data: customers });
    } catch (error) {
        console.error('Error in listCustomers:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
