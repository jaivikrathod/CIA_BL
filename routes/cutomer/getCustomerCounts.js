const db = require('../../models');

const getCustomerCounts = async (req, res) => {
    try {
        let count;
        if(req.userType == 'Admin') {
            count = await db.customers.count({ where: { is_active: 1 } });
        } else {
            count = await db.customers.count({ where: { user_id: req.userID, is_active: 1 } });
        }
        return res.status(200).json({ success: true, data: count });
    } catch (error) {
        console.error('Error in listCustomer:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};

const getNewCustomerCounts = async (req, res) => {
    try {
        let count;
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        if(req.userType == 'Admin') {
            count = await db.customers.count({
                where: {
                    created_at: { [db.Sequelize.Op.gte]: fiveDaysAgo },
                    is_active: 1
                }
            });
        } else {
            count = await db.customers.count({
                where: {
                    user_id: req.userID,
                    created_at: { [db.Sequelize.Op.gte]: fiveDaysAgo },
                    is_active: 1
                }
            });
        }
        return res.status(200).json({ success: true, data: count });
    } catch (error) {
        console.error("Error in getNewCustomerCounts:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
};

module.exports = {
    getCustomerCounts,
    getNewCustomerCounts
};
