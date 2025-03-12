const db = require('../../config/db')

exports.listInsurance = async (req, res) => {
    try {
        const [insurance] = await db.execute(`
            SELECT * 
            FROM insurance_details AS i1
            WHERE insurance_date = (
                SELECT MAX(insurance_date) 
                FROM insurance_details AS i2
                WHERE i1.common_id = i2.common_id 
                AND i1.customer_id = i2.customer_id
            )
        `);
        return res.json({ success: true, data: insurance });

    } catch (error) {
        console.error('Error while fetching insurrance Details', error);
        return res.status(500).json({ success: false, message: 'Error while fetching insurrance Details' + error });

    }
}