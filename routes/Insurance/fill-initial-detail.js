const db = require('../../config/db');

exports.InitialDetails = async (req, res) => {

    const data = await req.body;
    console.log(data);


    if (data.insuranceType) {
        try {
            let query;
            let params;
            let insertedId;

            if (data.id) {
                query = 'UPDATE insurance_details SET customer_id = ?, insurance_type = ? WHERE id = ?';
                params = [data.id, data.insuranceType, data.id];
                await db.execute(query, params);
                insertedId = data.id; // If updating, the ID is already known
            } else {
                // Fetch customer ID
                const customerQuery = 'SELECT id FROM customer WHERE email = ?';
                const [customerResult] = await db.execute(customerQuery, [data.mail]);

                if (customerResult.length === 0) {
                    return res.json({ success: false, message: "Customer not found" });
                }

                const customer_id = customerResult[0].id;

                // Insert into insurance_details
                query = 'INSERT INTO insurance_details (customer_id, insurance_type) VALUES(?, ?)';
                params = [customer_id, data.insuranceType];
                const [result] = await db.execute(query, params);

                insertedId = result.insertId; // Retrieve the ID of the inserted row
            }

            return res.json({ success: true, message: "Operation successful.", id: insertedId });
        } catch (e) {
            return res.json({ success: false, message: "Error occurred: " + e });
        }
    }


    if (data.segmentType) {
        try {
            let query;
            let params;
            if (data.id) {
                query = 'UPDATE insurance_details SET segment = ? WHERE id = ?';
                params = [data.segmentType,data.id];

                const [result] = await db.execute(query, params);
                return res.json({ success: true, message: "Operation successful.", id: data.id });
            } else {
                return res.json({ success: false, message: "Id Not found." });
            }

        } catch (e) {
            return res.json({ success: false, message: "Error occurred: " + e });
        }
    }

    if (data.detailedType) {
        try {
            let query;
            let params;
            if (data.id) {
                query = 'UPDATE insurance_details SET segment_detail_type = ? WHERE id = ?';
                params = [data.detailedType, data.id];
                const response = await db.execute(query, params);
                return res.json({ success: true, message: "Operation successful.", id: data.id });
            } else {
                return res.json({ success: false, message: "Id Not found." });

            }

        } catch (e) {
            return res.json({ success: false, message: "Error occurred: " + e });
        }
    }

}
