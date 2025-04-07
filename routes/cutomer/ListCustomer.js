const db = require('../../config/db');

exports.listCustomers = async (req, res) => {
    try {

        const adminType = req.headers['admintype'];
        let customers;
        
        if(adminType =='Admin'){
            [customers] = await db.execute('SELECT * FROM customer');
        }else{
            const user_id = req.headers['x-user-id'];
            [customers] = await db.execute('SELECT * FROM customer WHERE user_id = ?', [user_id]);
        }

        if (customers.length === 0) {
            return res.status(200).json({ success: true, message: 'No customers found.' });
        }

        customers.forEach(customer => {
            if (customer.dob && !isNaN(new Date(customer.dob).getTime())) {
                const dobDate = new Date(customer.dob);
                customer.dob = dobDate.toISOString().split('T')[0];
                const diff = Date.now() - dobDate.getTime();
                const ageDate = new Date(diff);
                customer.age = Math.abs(ageDate.getUTCFullYear() - 1970);
            } else {
                customer.dob = null;
                customer.age = null;
            }
        });

        return res.status(200).json({ success: true, data: customers });
    } catch (error) {
        console.error('Error in listCustomers:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
