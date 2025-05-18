const db = require('../../config/db');

exports.InitialDetails = async (req, res) => {
    const data = await req.body;

    try {
        // Corrected INSERT query syntax

        if (data.id) {

            const response = await db.execute(
                'UPDATE insurance_common_details SET insurance_type = ?, user_id = ?, segment = ?,segment_vehicle_type=?, segment_vehicle_detail_type = ?,vehicle_number=NULL,model=NULL,manufacturer=NULL,fuel_type=NULL,yom=NULL, customer_id = ? WHERE id = ?',
                [data.insurance_type, data.user_id, data.segment,data.segment_vehicle_type, data.segment_vehicle_detail_type, data.customer_id, data.id]
            );

            if (response.length > 0) {
                return res.json({ success: true, message: "Operation successful."  });
            } else {
                return res.json({ success: false, message: "Operation failed." });
            }

        } else {

            const response = await db.execute(
                'INSERT INTO insurance_common_details (insurance_type, user_id,segment,segment_vehicle_type ,segment_vehicle_detail_type, customer_id) VALUES (?, ?, ?, ?, ?,?)',
                [data.insurance_type, data.user_id, data.segment,data.segment_vehicle_type, data.segment_vehicle_detail_type, data.customer_id]
            );

            if (response.length > 0) {
                return res.json({ success: true, message: "Operation successful.", id: response[0].insertId });
            } else {
                return res.json({ success: false, message: "Operation failed." });
            }
        }
    } catch (e) {
        return res.json({ success: false, message: "Error occurred: " + e });
    }
}
