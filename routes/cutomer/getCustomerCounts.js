const db = require('../../config/db');


const getCustomerCounts = async (req, res) => {
    try {
        const [CustomerCounts] = await db.execute('SELECT COUNT(*) AS count FROM customer');
        return res.status(200).json({ success: true, data: CustomerCounts[0].count });
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

const getNewCustomerCounts = async (req, res) => {
    try {
        const [CustomerCounts] = await db.execute(
            "SELECT COUNT(*) AS count FROM customer WHERE created_at >= NOW() - INTERVAL 5 DAY"
        );
        return res.status(200).json({ success: true, data: CustomerCounts[0].count });
    } catch (error) {
        console.error("Error in getNewCustomerCounts:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
};


module.exports = {
    getCustomerCounts,
    getNewCustomerCounts
};
