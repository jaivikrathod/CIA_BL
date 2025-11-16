const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler');
const { Op, fn, col, literal } = require('sequelize');
const mysql = require('../../config/db');

exports.listInsurance = async (req, res) => {
    try {
        let { search, segment, minAge, maxAge, page = 1, limit, admin, dateRange, fromDate, toDate } = req.body;

        page = Number(page) || 1;
        limit = limit !== undefined && limit !== null && limit !== '' ? Number(limit) : null; // null = no limit

        const offset = limit ? (page - 1) * limit : 0;
        const limitPlusOne = limit ? limit + 1 : null;

        let query = `
            SELECT 
                icd.*, 
                idt.insurance_count,
                idt.common_id,
                idt.insurance_date, 
                c.full_name, 
                c.email,
                c.primary_mobile,
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
            JOIN customers c 
                ON icd.customer_id = c.id
            WHERE 1=1 AND c.is_active = 1
        `;
        const params = [];

        // Search filter
        if (search && search.trim() !== '') {
            query += ` AND (
                icd.vehicle_number LIKE ? OR 
                icd.insurance_type LIKE ? OR 
                icd.model LIKE ? OR 
                icd.manufacturer LIKE ? OR 
                idt.policy_no LIKE ? OR
                c.full_name LIKE ? OR 
                c.email LIKE ? OR
                c.primary_mobile LIKE ?
            )`;
            const searchPattern = `%${search}%`;
            params.push(
                searchPattern, searchPattern, searchPattern,
                searchPattern, searchPattern, searchPattern,
                searchPattern,searchPattern
            );
        }

        // Segment filter
        if (segment && segment.trim() !== '') {
            query += ' AND icd.insurance_type = ?';
            params.push(segment);
        }

        // Admin/user filter
        if (req.userType != 'Admin') {
            query += ' AND icd.user_id = ?';
            params.push(req.userID);
        } else if (admin && admin.trim() !== '') {
            query += ' AND icd.user_id = ?';
            params.push(admin);
        }

        // Age range filter
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

        // Date range filter
        const pad = (num) => (num < 10 ? `0${num}` : `${num}`);
        const formatYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

        let startDateFilter = null;
        let endDateFilter = null;

        if ((dateRange && String(dateRange).trim() !== '') || (fromDate && toDate)) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const normalizedFrom = fromDate ? formatYMD(new Date(fromDate)) : null;
            const normalizedTo = toDate ? formatYMD(new Date(toDate)) : null;

            switch (String(dateRange || '').trim()) {
                case 'today': {
                    startDateFilter = formatYMD(today);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'yesterday': {
                    const y = new Date(today);
                    y.setDate(y.getDate() - 1);
                    startDateFilter = formatYMD(y);
                    endDateFilter = formatYMD(y);
                    break;
                }
                case 'last7': {
                    const s = new Date(today);
                    s.setDate(s.getDate() - 6);
                    startDateFilter = formatYMD(s);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'last30': {
                    const s = new Date(today);
                    s.setDate(s.getDate() - 29);
                    startDateFilter = formatYMD(s);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'thisMonth': {
                    const s = new Date(today.getFullYear(), today.getMonth(), 1);
                    startDateFilter = formatYMD(s);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'lastMonth': {
                    const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    const lastOfLastMonth = new Date(firstOfThisMonth - 1);
                    const firstOfLastMonth = new Date(lastOfLastMonth.getFullYear(), lastOfLastMonth.getMonth(), 1);
                    startDateFilter = formatYMD(firstOfLastMonth);
                    endDateFilter = formatYMD(lastOfLastMonth);
                    break;
                }
                case 'thisYear': {
                    const s = new Date(today.getFullYear(), 0, 1);
                    startDateFilter = formatYMD(s);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'custom':
                default: {
                    if (normalizedFrom && normalizedTo) {
                        startDateFilter = normalizedFrom;
                        endDateFilter = normalizedTo;
                    } else if (normalizedFrom) {
                        startDateFilter = normalizedFrom;
                        endDateFilter = normalizedFrom;
                    } else if (normalizedTo) {
                        startDateFilter = normalizedTo;
                        endDateFilter = normalizedTo;
                    }
                }
            }

            if (startDateFilter && endDateFilter) {
                query += ' AND DATE(idt.insurance_date) BETWEEN ? AND ?';
                params.push(startDateFilter, endDateFilter);
            }
        }

        // Order + pagination
        if (!limit || limit === 0) {
            query += ' ORDER BY icd.id DESC'; // no limit = fetch all
        } else {
            query += ` ORDER BY icd.id DESC LIMIT ${Number(limitPlusOne)} OFFSET ${Number(offset)}`;
        }

        const [insurance] = await mysql.execute(query, params);

        let isMoreData = false;
        if (limit && insurance.length > limit) {
            isMoreData = true;
            insurance.pop(); // Remove extra record
        }

        if (insurance.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No insurance records found.',
                data: [],
                pagination: {
                    page,
                    limit: limit || 0,
                    isMoreData: false
                }
            });
        }

        // Format DOB + calculate age
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
                limit: limit || 0, // 0 means all
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


exports.insurancePendingAmountList = async (req, res) => {
    try {
        let { search, segment, minAge, maxAge, page = 1, limit, admin, dateRange, fromDate, toDate } = req.body;

        page = Number(page) || 1;
        limit = limit !== undefined && limit !== null && limit !== '' ? Number(limit) : null; // null = no limit

        const offset = limit ? (page - 1) * limit : 0;
        const limitPlusOne = limit ? limit + 1 : null;

//         let query = `
//     SELECT 
//         icd.*, 
//         idt.insurance_count,
//         idt.common_id,
//         idt.insurance_date, 
//         c.full_name, 
//         c.email,
//         c.primary_mobile,
//         c.dob
//     FROM insurance_common_details icd
//     JOIN (
//         SELECT 
//             insurance_id, 
//             MAX(insurance_count) AS max_count
//         FROM insurance_details
//         GROUP BY insurance_id
//     ) AS max_counts
//         ON icd.id = max_counts.insurance_id
//     JOIN insurance_details idt 
//         ON idt.insurance_id = max_counts.insurance_id 
//         AND idt.insurance_count = max_counts.max_count
//     JOIN customers c 
//         ON icd.customer_id = c.id
//     WHERE 
//         c.is_active = 1
//         AND (
//             idt.amount IS NULL 
//             OR idt.net_amount IS NULL 
//             OR idt.net_income IS NULL
//         )
// `;
//         let query = `SELECT 
//     icd.*, 
//     idt.insurance_count,
//     idt.common_id,
//     idt.insurance_date, 
//     c.full_name, 
//     c.email,
//     c.primary_mobile,
//     c.dob
// FROM insurance_common_details icd
// JOIN (
//     SELECT 
//         insurance_id, 
//         MAX(insurance_count) AS max_count
//     FROM insurance_details
//     GROUP BY insurance_id
// ) AS max_counts
//     ON icd.id = max_counts.insurance_id
// JOIN insurance_details idt 
//     ON idt.insurance_id = max_counts.insurance_id 
//     AND idt.insurance_count = max_counts.max_count
// JOIN customers c 
//     ON icd.customer_id = c.id
// WHERE 
//     c.is_active = 1
//     AND EXISTS (
//         SELECT 1 
//         FROM insurance_details d 
//         WHERE d.insurance_id = icd.id 
//         AND (
//             d.amount IS NULL 
//             OR d.net_amount IS NULL 
//             OR d.net_income IS NULL
//         )
//     )`;

        let query = `SELECT 
    icd.*, 
    idt.*,
    c.full_name, 
    c.email,
    c.primary_mobile,
    c.dob
FROM insurance_common_details icd
JOIN insurance_details idt 
    ON icd.id = idt.insurance_id
JOIN customers c 
    ON icd.customer_id = c.id
WHERE 
    c.is_active = 1
    AND (
        idt.amount IS NULL 
        OR idt.net_amount IS NULL 
        OR idt.net_income IS NULL
    )
        `;

        const params = [];

        // Search filter
        if (search && search.trim() !== '') {
            query += ` AND (
                icd.vehicle_number LIKE ? OR 
                icd.insurance_type LIKE ? OR 
                icd.model LIKE ? OR 
                icd.manufacturer LIKE ? OR 
                c.full_name LIKE ? OR 
                c.email LIKE ? OR
                c.primary_mobile LIKE ?
            )`;
            const searchPattern = `%${search}%`;
            params.push(
                searchPattern, searchPattern, searchPattern,
                searchPattern, searchPattern, searchPattern, searchPattern
            );
        }

        // Segment filter
        if (segment && segment.trim() !== '') {
            query += ' AND icd.insurance_type = ?';
            params.push(segment);
        }

        // Admin/user filter
        if (req.userType != 'Admin') {
            query += ' AND icd.user_id = ?';
            params.push(req.userID);
        } else if (admin && admin.trim() !== '') {
            query += ' AND icd.user_id = ?';
            params.push(admin);
        }

        // Age range filter
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

        // Date range filter
        const pad = (num) => (num < 10 ? `0${num}` : `${num}`);
        const formatYMD = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

        let startDateFilter = null;
        let endDateFilter = null;

        if ((dateRange && String(dateRange).trim() !== '') || (fromDate && toDate)) {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const normalizedFrom = fromDate ? formatYMD(new Date(fromDate)) : null;
            const normalizedTo = toDate ? formatYMD(new Date(toDate)) : null;

            switch (String(dateRange || '').trim()) {
                case 'today': {
                    startDateFilter = formatYMD(today);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'yesterday': {
                    const y = new Date(today);
                    y.setDate(y.getDate() - 1);
                    startDateFilter = formatYMD(y);
                    endDateFilter = formatYMD(y);
                    break;
                }
                case 'last7': {
                    const s = new Date(today);
                    s.setDate(s.getDate() - 6);
                    startDateFilter = formatYMD(s);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'last30': {
                    const s = new Date(today);
                    s.setDate(s.getDate() - 29);
                    startDateFilter = formatYMD(s);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'thisMonth': {
                    const s = new Date(today.getFullYear(), today.getMonth(), 1);
                    startDateFilter = formatYMD(s);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'lastMonth': {
                    const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    const lastOfLastMonth = new Date(firstOfThisMonth - 1);
                    const firstOfLastMonth = new Date(lastOfLastMonth.getFullYear(), lastOfLastMonth.getMonth(), 1);
                    startDateFilter = formatYMD(firstOfLastMonth);
                    endDateFilter = formatYMD(lastOfLastMonth);
                    break;
                }
                case 'thisYear': {
                    const s = new Date(today.getFullYear(), 0, 1);
                    startDateFilter = formatYMD(s);
                    endDateFilter = formatYMD(today);
                    break;
                }
                case 'custom':
                default: {
                    if (normalizedFrom && normalizedTo) {
                        startDateFilter = normalizedFrom;
                        endDateFilter = normalizedTo;
                    } else if (normalizedFrom) {
                        startDateFilter = normalizedFrom;
                        endDateFilter = normalizedFrom;
                    } else if (normalizedTo) {
                        startDateFilter = normalizedTo;
                        endDateFilter = normalizedTo;
                    }
                }
            }

            if (startDateFilter && endDateFilter) {
                query += ' AND DATE(idt.insurance_date) BETWEEN ? AND ?';
                params.push(startDateFilter, endDateFilter);
            }
        }

        // Order + pagination
        if (!limit || limit === 0) {
            query += ' ORDER BY icd.id DESC'; // no limit = fetch all
        } else {
            query += ` ORDER BY icd.id DESC LIMIT ${Number(limitPlusOne)} OFFSET ${Number(offset)}`;
        }

        const [insurance] = await mysql.execute(query, params);

        let isMoreData = false;
        if (limit && insurance.length > limit) {
            isMoreData = true;
            insurance.pop(); // Remove extra record
        }

        if (insurance.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No insurance records found.',
                data: [],
                pagination: {
                    page,
                    limit: limit || 0,
                    isMoreData: false
                }
            });
        }

        // Format DOB + calculate age
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
                limit: limit || 0, // 0 means all
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


// // Get All Insurance Details for a Specific common_id
// exports.getParticularInsurance = async (req, res) => {
//     try {
//         const { common_id } = req.query;

//         if (!common_id) {
//             return ResponseHandler.validationError(res, 'common_id is required');
//         }

//         const insurance = await db.insurance_details.findAll({
//             where: { common_id },
//             include: [
//                 {
//                     model: db.insurance_common_details,
//                     as: 'insurance_common_detail',
//                     attributes: [
//                         'id', 'customer_id', 'segment', 'vehicle_number', 'insurance_type',
//                         'segment_vehicle_type', 'segment_vehicle_detail_type', 'model', 'manufacturer', 'fuel_type', 'yom'
//                     ]
//                 }
//             ],
//             order: [['insurance_count', 'DESC']]
//         });

//         if (!insurance || insurance.length === 0) {
//             return ResponseHandler.notFound(res, 'No insurance found for this common_id');
//         }

//         const flattenedInsurance = insurance.map(item => ({
//             ...item,
//             ...item.insurance_common_detail,
//         }));

//         return ResponseHandler.success(res, 200, 'Insurance details retrieved successfully', flattenedInsurance);

//     } catch (error) {
//         console.error('Error while fetching particular insurance details:', error);
//         return ResponseHandler.error(res, 500, 'Error while fetching particular insurance details.', error);
//     }
// };


function formatDateOnly(date) {
    if (!date) return null;
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    return date.split('T')[0];
}

exports.getParticularInsurance = async (req, res) => {
    try {
        const { common_id } = req.query;

        if (!common_id) {
            return res.status(400).json({
                success: false,
                message: 'common_id is required'
            });
        }

        const [insurance] = await mysql.execute(`
            SELECT 
                idt.*, 
                icd.id AS common_id, 
                icd.customer_id,
                icd.segment,
                icd.vehicle_number,
                icd.insurance_type,
                icd.model,
                icd.segment_vehicle_type,
                icd.segment_vehicle_detail_type,
                icd.manufacturer,
                icd.fuel_type,
                icd.yom,
                us.full_name
            FROM 
                insurance_details idt
            JOIN 
                insurance_common_details icd 
                ON icd.id = idt.insurance_id
            JOIN 
                users us
                ON us.id = idt.user_id
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

        const formattedInsurance = insurance.map(row => ({
            ...row,
            policy_start_date: formatDateOnly(row.policy_start_date),
            policy_expiry_date: formatDateOnly(row.policy_expiry_date),
            insurance_date: formatDateOnly(row.insurance_date),
            collection_date: formatDateOnly(row.collection_date),
        }));

        return res.json({ success: true, data: formattedInsurance });

    } catch (error) {
        console.error('Error while fetching particular insurance details:', error);
        return res.status(500).json({
            success: false,
            message: 'Error while fetching particular insurance details: ' + error.message
        });
    }
};


exports.getParticularInsuranceDocuments = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return ResponseHandler.validationError(res, 'insurance id is required');
        }

        const insurance = await db.insurance_details.findOne({
            where: { id },
            attributes: ['documents']
        });
        if (!insurance || insurance.length === 0) {
            return ResponseHandler.notFound(res, 'No insurance document found for this common_id');
        }

        return ResponseHandler.success(res, 200, 'Insurance document details retrieved successfully', insurance);

    } catch (error) {
        console.error('Error while fetching particular insurance document details:', error);
        return ResponseHandler.error(res, 500, 'Error while fetching particular insurance document details.', error);
    }
};
