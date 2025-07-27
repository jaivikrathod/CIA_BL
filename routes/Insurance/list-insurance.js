const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler');
const { Op, fn, col, literal } = require('sequelize');
const mysql = require('../../config/db');

// List Insurance - only latest insurance per insurance_id
// exports.listInsurance = async (req, res) => {
//     try {
//         let { search, segment, minAge, maxAge, page = 1, limit = 10, admin } = req.body;
//         const offset = (page - 1) * limit;
//         const limitPlusOne = limit + 1;

//         // Build where conditions for insurance_common_details
//         let icdWhere = {};
//         let customerWhere = {};
//         let insuranceDetailsWhere = {};

//         // Add search filter if provided
//         if (search && search.trim() !== '') {
//             const searchPattern = { [Op.like]: `%${search}%` };
//             icdWhere = {
//                 ...icdWhere,
//                 [Op.or]: [
//                     { vehicle_number: searchPattern },
//                     { insurance_type: searchPattern },
//                     // { segment_detail_type: searchPattern },
//                     { model: searchPattern },
//                     { manufacturer: searchPattern }
//                 ]
//             };
//             customerWhere = {
//                 [Op.or]: [
//                     { full_name: searchPattern },
//                     { email: searchPattern }
//                 ]
//             };
//         }

//         // Add segment filter if provided
//         if (segment && segment.trim() !== '') {
//             icdWhere.insurance_type = segment;
//         }

//         // Add Admin filter if provided
//         if (req.userType !== 'Admin') {
//             icdWhere.user_id = req.userID;
//         } else if (admin && admin.trim() !== '') {
//             icdWhere.user_id = admin;
//         }

//         // Add age range filter if provided
//         if (minAge && minAge.trim() !== '' && maxAge && maxAge.trim() !== '') {
//             const currentDate = new Date();
//             const currentYear = currentDate.getFullYear();
//             const currentMonth = currentDate.getMonth();
//             const currentDay = currentDate.getDate();
//             const minAgeDate = new Date(currentYear - maxAge, currentMonth, currentDay);
//             const maxAgeDate = new Date(currentYear - minAge, currentMonth, currentDay);
//             customerWhere.dob = {
//                 [Op.between]: [minAgeDate.toISOString().split('T')[0], maxAgeDate.toISOString().split('T')[0]]
//             };
//         }

//         // Find latest insurance_detail IDs for each insurance_id
//         const latestInsuranceDetails = await db.insurance_details.findAll({
//             attributes: [
//                 [fn('MAX', col('id')), 'id']
//             ],
//             group: ['insurance_id']
//         });
//         const latestIds = latestInsuranceDetails.map(row => row.get('id'));

//         // Now query insurance_common_details with joins and filters
//         const insurance = await db.insurance_common_details.findAll({
//             where: icdWhere,
//             include: [
//                 {
//                     model: db.insurance_details,
//                     as: 'insurance_details',
//                     where: {
//                         id: { [Op.in]: latestIds }
//                     },
//                     required: true,
//                     attributes: [
//                         'insurance_count',
//                         'common_id',
//                         'insurance_date',
//                         'insurance_id',
//                         'id'
//                     ]
//                 },
//                 {
//                     model: db.customers,
//                     as: 'customer',
//                     // where: customerWhere,
//                     required: false,
//                     attributes: ['full_name', 'email', 'dob']
//                 }
//             ],
//             order: [['id', 'DESC']],
//             offset: limit === 0 ? undefined : offset,
//             limit: limit === 0 ? undefined : limitPlusOne
//         });

//         let insuranceList = insurance.map(icd => {
//             const record = icd.toJSON();
//             // Flatten insurance_details and customer
//             if (record.insurance_details && Array.isArray(record.insurance_details) && record.insurance_details.length > 0) {
//                 Object.assign(record, record.insurance_details[0]);
//                 delete record.insurance_details;
//             }
//             if (record.customer) {
//                 Object.assign(record, record.customer);
//                 delete record.customer;
//             }
//             return record;
//         });

//         let isMoreData = false;
//         if (limit > 0 && insuranceList.length > limit) {
//             isMoreData = true;
//             insuranceList.pop(); // Remove the extra record
//         }

//         if (insuranceList.length === 0) {
//             return ResponseHandler.emptyList(res, 'No insurance records found.', {
//                 page,
//                 limit,
//                 isMoreData: false
//             });
//         }

//         // Format DOB and calculate age
//         insuranceList?.forEach(record => {
//             if (record.dob && !isNaN(new Date(record.dob).getTime())) {
//                 const dobDate = new Date(record.dob);
//                 record.dob = dobDate.toISOString().split('T')[0];
//                 const diff = Date.now() - dobDate.getTime();
//                 const ageDate = new Date(diff);
//                 record.age = Math.abs(ageDate.getUTCFullYear() - 1970);
//             } else {
//                 record.dob = null;
//                 record.age = null;
//             }
//         });

//         return ResponseHandler.list(res, insuranceList, {
//             page,
//             limit,
//             isMoreData
//         }, 'Insurance records retrieved successfully');

//     } catch (error) {
//         console.error('Error while fetching insurance details:' + error);
//         return ResponseHandler.error(res, 500, error);
//     }
// };


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
            JOIN customers c 
                ON icd.customer_id = c.id
            WHERE 1=1
        `;
        const params = [];

        // Add search filter if provided
        if (search && search.trim() !== '') {
            query += ` AND (
                icd.vehicle_number LIKE ? OR 
                icd.insurance_type LIKE ? OR 
                
                icd.model LIKE ? OR 
                icd.manufacturer LIKE ? OR 
                c.full_name LIKE ? OR 
                c.email LIKE ?
            )`;
            const searchPattern = `%${search}%`;
            params.push(
                searchPattern, searchPattern, searchPattern, 
                searchPattern, searchPattern, searchPattern
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

        const [insurance] = await mysql.execute(query, params);

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
