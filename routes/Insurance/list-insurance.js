const db = require('../../config/db');

// List Insurance - only latest insurance per insurance_id
exports.listInsurance = async (req, res) => {
    try {
        const [insurance] = await db.execute(`
            SELECT 
                icd.*, 
                idt.insurance_count,
                idt.common_id,
                idt.insurance_date, 
                c.full_name, 
                c.email
            FROM insurance_common_details icd
            JOIN (
                SELECT 
                    insurance_id, 
                    MAX(insurance_count) AS max_count
                FROM insurance_details
                GROUP BY insurance_id
            ) AS max_counts
                ON icd.id = max_counts.insurance_id
            JOIN insurance_details idt 
                ON idt.insurance_id = max_counts.insurance_id 
                AND idt.insurance_count = max_counts.max_count
            JOIN customer c 
                ON icd.customer_id = c.id;
        `);

        return res.json({ success: true, data: insurance });

    } catch (error) {
        console.error('Error while fetching insurance details:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error while fetching insurance details: ' + error.message 
        });
    }
};

// Get All Insurance Details for a Specific common_id
exports.getParticularInsurance = async (req, res) => {
    try {
        const { common_id } = req.query;

        if (!common_id) {
            return res.status(400).json({ 
                success: false, 
                message: 'common_id is required' 
            });
        }

        const [insurance] = await db.execute(`
            SELECT 
                idt.*, 
                icd.id AS common_id, 
                icd.customer_id,
                icd.segment,
                icd.vehicle_number,
                icd.insurance_type,
                icd.segment_detail_type,
                icd.model,
                icd.manufacturer,
                icd.fuel_type,
                icd.yom
            FROM 
                insurance_details idt
            JOIN 
                insurance_common_details icd 
                ON icd.id = idt.insurance_id
            WHERE 
                idt.common_id = ?
            ORDER BY 
                idt.insurance_count DESC
        `, [common_id]);
        

        if (insurance.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No insurance found for this common_id' 
            });
        }

        return res.json({ success: true, data: insurance });

    } catch (error) {
        console.error('Error while fetching particular insurance details:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Error while fetching particular insurance details: ' + error.message 
        });
    }
};
