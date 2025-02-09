const db = require('../../config/db')

exports.listInsurance = async (req, res) => {
    try {
        const [insurance] = await db.execute('SELECT * FROM insurance_details');
        return res.json({ success: true, data: insurance });

    } catch (error) {
        console.error('Error while fetching insurrance Details', error);
        return res.status(500).json({ success: false, message: 'Error while fetching insurrance Details' + error });

    }
}