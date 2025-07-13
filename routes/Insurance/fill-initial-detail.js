const db = require('../../models');

exports.InitialDetails = async (req, res) => {
    const data = await req.body;

    try {
        if (data.id) {
            const [affectedRows] = await db.insurance_common_details.update(
                {
                    insurance_type: data.insurance_type,
                    user_id: data.user_id,
                    segment: data.segment,
                    segment_vehicle_type: data.segment_vehicle_type,
                    segment_vehicle_detail_type: data.segment_vehicle_detail_type,
                    vehicle_number: null,
                    model: null,
                    manufacturer: null,
                    fuel_type: null,
                    yom: null,
                    customer_id: data.customer_id
                },
                { where: { id: data.id } }
            );

            if (affectedRows > 0) {
                return res.json({ success: true, message: "Operation successful." });
            } else {
                return res.json({ success: false, message: "Operation failed." });
            }
        } else {
            const response = await db.insurance_common_details.create({
                insurance_type: data.insurance_type,
                user_id: data.user_id,
                segment: data.segment,
                segment_vehicle_type: data.segment_vehicle_type,
                segment_vehicle_detail_type: data.segment_vehicle_detail_type,
                customer_id: data.customer_id
            });

            if (response && response.id) {
                return res.json({ success: true, message: "Operation successful.", id: response.id });
            } else {
                return res.json({ success: false, message: "Operation failed." });
            }
        }
    } catch (e) {
        return res.json({ success: false, message: "Error occurred: " + e });
    }
}
