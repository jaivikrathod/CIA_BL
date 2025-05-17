const db = require('../../config/db');

// List Insurance - only latest insurance per insurance_id
exports.listInsurance = async (req, res) => {
    try {
        let { search, segment, minAge, maxAge, page = 1, limit = 10,admin } = req.body;
        const offset = (page - 1) * limit;
        const limitPlusOne = limit + 1;

        let query = `
            SELECT 
                icd.*, 
                idt.insurance_count,
                idt.common_id,
                idt.insurance_date, 
                c.full_name, 
                c.email,
                c.dob
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
                ON icd.customer_id = c.id
            WHERE 1=1
        `;
        const params = [];

        // Add search filter if provided
        if (search && search.trim() !== '') {
            query += ` AND (
                icd.vehicle_number LIKE ? OR 
                icd.insurance_type LIKE ? OR 
                icd.segment_detail_type LIKE ? OR 
                icd.model LIKE ? OR 
                icd.manufacturer LIKE ? OR 
                c.full_name LIKE ? OR 
                c.email LIKE ?
            )`;
            const searchPattern = `%${search}%`;
            params.push(
                searchPattern, searchPattern, searchPattern, 
                searchPattern, searchPattern, searchPattern, 
                searchPattern
            );
        }

        // Add segment filter if provided
        if (segment && segment.trim() !== '') {
            query += ' AND icd.insurance_type = ?';
            params.push(segment);
        }
        
        // Add Admin filter if provided
        if(req.userType != 'Admin') {
            query += ' AND icd.user_id = ?';
            params.push(req.userID);
        }
        else if (admin && admin.trim() !== '') {
            query += ' AND icd.user_id = ?';
            params.push(admin);
        }

        // Add age range filter if provided
        if (minAge && minAge.trim() !== '' && maxAge && maxAge.trim() !== '') {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDate();

            const minAgeDate = new Date(currentYear - maxAge, currentMonth, currentDay);
            const maxAgeDate = new Date(currentYear - minAge, currentMonth, currentDay);
            query += ' AND c.dob BETWEEN ? AND ?';
            params.push(minAgeDate.toISOString().split('T')[0], maxAgeDate.toISOString().split('T')[0]);
        }

        if(limit == 0) {
            query += ' ORDER BY icd.id DESC';
        } else {
            query += ' ORDER BY icd.id DESC LIMIT ? OFFSET ?';
            params.push(limitPlusOne, offset);
        }

        console.log('Final Query:', query);
        console.log('Query Parameters:', params);

        const [insurance] = await db.execute(query, params);

        let isMoreData = false;
        if (insurance.length > limit) {
            isMoreData = true;
            insurance.pop(); // Remove the extra record
        }

        if (insurance.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No insurance records found.',
                data: [],
                pagination: {
                    page,
                    limit,
                    isMoreData: false
                }
            });
        }

        // Format DOB and calculate age
        insurance.forEach(record => {
            if (record.dob && !isNaN(new Date(record.dob).getTime())) {
                const dobDate = new Date(record.dob);
                record.dob = dobDate.toISOString().split('T')[0];
                const diff = Date.now() - dobDate.getTime();
                const ageDate = new Date(diff);
                record.age = Math.abs(ageDate.getUTCFullYear() - 1970);
            } else {
                record.dob = null;
                record.age = null;
            }
        });

        return res.status(200).json({
            success: true,
            data: insurance,
            pagination: {
                page,
                limit,
                isMoreData
            }
        });

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
