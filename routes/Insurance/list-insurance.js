const db = require('../../config/db')

exports.listInsurance = async (req, res) => {
    try {
        const [insurance] = await db.execute(`
            SELECT i.id,i.insurance_Date,i.common_id,i.insurance_type, c.full_name, c.email
            FROM insurance_details AS i
            JOIN customer AS c ON i.customer_id = c.id
            WHERE i.is_latest = 1
        `);
        
        return res.json({ success: true, data: insurance });

    } catch (error) {
        console.error('Error while fetching insurrance Details', error);
        return res.status(500).json({ success: false, message: 'Error while fetching insurrance Details' + error });

    }
}

exports.getParticularInsurance = async (req, res) => {
    try {
        const { common_id } = req.query;
        if (!common_id) {
            return res.status(400).json({ success: false, message: 'common_id is required' });
        }
        const [insurance] = await db.execute(`
            SELECT * 
            FROM insurance_details 
            WHERE common_id = ? 
            ORDER BY insurance_date DESC
        `, [common_id]);

        if (insurance.length === 0) {
            return res.status(404).json({ success: false, message: 'No insurance found for this common_id' });
        }

        return res.json({ success: true, data: insurance });

    } catch (error) {
        console.error('Error while fetching insurrance Details', error);
        return res.status(500).json({ success: false, message: 'Error while fetching insurrance Details' + error });

    }
}