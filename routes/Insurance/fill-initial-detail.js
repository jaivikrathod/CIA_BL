const db = require('../../config/db');

exports.InitialDetails = async (req, res) => {
    const data = await req.body;

    try {
        // Corrected INSERT query syntax
        const response = await db.execute(
            'INSERT INTO insurance_common_details (insurance_type, user_id,segment, segment_detail_type, customer_id) VALUES (?, ?, ?, ?, ?)',
            [data.insuranceType, data.userID, data.segmentType, data.detailedType, data.customerID]
        );
        
        if(response.length > 0){
            return res.json({ success: true, message: "Operation successful.", id: response[0].insertId });
        }else{
            return res.json({ success: false, message: "Operation failed." });
        }
    } catch (e) {
        return res.json({ success: false, message: "Error occurred: " + e });
    }
}
