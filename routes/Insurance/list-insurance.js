const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler');
const { Op, fn, col, literal } = require('sequelize');

// List Insurance - only latest insurance per insurance_id
exports.listInsurance = async (req, res) => {
    try {
        let { search, segment, minAge, maxAge, page = 1, limit = 10, admin } = req.body;
        const offset = (page - 1) * limit;
        const limitPlusOne = limit + 1;

        // Build where conditions for insurance_common_details
        let icdWhere = {};
        let customerWhere = {};
        let insuranceDetailsWhere = {};

        // Add search filter if provided
        if (search && search.trim() !== '') {
            const searchPattern = { [Op.like]: `%${search}%` };
            icdWhere = {
                ...icdWhere,
                [Op.or]: [
                    { vehicle_number: searchPattern },
                    { insurance_type: searchPattern },
                    { segment_detail_type: searchPattern },
                    { model: searchPattern },
                    { manufacturer: searchPattern }
                ]
            };
            customerWhere = {
                [Op.or]: [
                    { full_name: searchPattern },
                    { email: searchPattern }
                ]
            };
        }

        // Add segment filter if provided
        if (segment && segment.trim() !== '') {
            icdWhere.insurance_type = segment;
        }

        // Add Admin filter if provided
        if (req.userType !== 'Admin') {
            icdWhere.user_id = req.userID;
        } else if (admin && admin.trim() !== '') {
            icdWhere.user_id = admin;
        }

        // Add age range filter if provided
        if (minAge && minAge.trim() !== '' && maxAge && maxAge.trim() !== '') {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDate();
            const minAgeDate = new Date(currentYear - maxAge, currentMonth, currentDay);
            const maxAgeDate = new Date(currentYear - minAge, currentMonth, currentDay);
            customerWhere.dob = {
                [Op.between]: [minAgeDate.toISOString().split('T')[0], maxAgeDate.toISOString().split('T')[0]]
            };
        }

        // Find latest insurance_count for each insurance_id
        // This is a workaround for the SQL join logic
        const latestInsurance = await db.insurance_details.findAll({
            attributes: [
                'insurance_id',
                [fn('MAX', col('insurance_count')), 'max_count']
            ],
            group: ['insurance_id']
        });
        const latestMap = {};
        latestInsurance.forEach(row => {
            latestMap[row.insurance_id] = row.get('max_count');
        });

        // Now query insurance_common_details with joins and filters
        const insurance = await db.insurance_common_details.findAll({
            where: icdWhere,
            include: [
                {
                    model: db.insurance_details,
                    as: 'insurance_details',
                    where: {
                        insurance_count: { [Op.col]: 'insurance_details.max_count' }
                    },
                    required: true,
                    attributes: [
                        'insurance_count',
                        'common_id',
                        'insurance_date',
                        'insurance_id',
                        'id'
                    ]
                },
                {
                    model: db.customer,
                    as: 'customer',
                    where: customerWhere,
                    required: true,
                    attributes: ['full_name', 'email', 'dob']
                }
            ],
            order: [['id', 'DESC']],
            offset: limit === 0 ? undefined : offset,
            limit: limit === 0 ? undefined : limitPlusOne
        });

        let insuranceList = insurance.map(icd => {
            const record = icd.toJSON();
            // Flatten insurance_details and customer
            if (record.insurance_details && Array.isArray(record.insurance_details) && record.insurance_details.length > 0) {
                Object.assign(record, record.insurance_details[0]);
                delete record.insurance_details;
            }
            if (record.customer) {
                Object.assign(record, record.customer);
                delete record.customer;
            }
            return record;
        });

        let isMoreData = false;
        if (limit > 0 && insuranceList.length > limit) {
            isMoreData = true;
            insuranceList.pop(); // Remove the extra record
        }

        if (insuranceList.length === 0) {
            return ResponseHandler.emptyList(res, 'No insurance records found.', {
                page,
                limit,
                isMoreData: false
            });
        }

        // Format DOB and calculate age
        insuranceList?.forEach(record => {
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

        return ResponseHandler.list(res, insuranceList, {
            page,
            limit,
            isMoreData
        }, 'Insurance records retrieved successfully');

    } catch (error) {
        console.error('Error while fetching insurance details:', error);
        return ResponseHandler.error(res, 500, error);
    }
};

// Get All Insurance Details for a Specific common_id
exports.getParticularInsurance = async (req, res) => {
    try {
        const { common_id } = req.query;

        if (!common_id) {
            return ResponseHandler.validationError(res, 'common_id is required');
        }

        const insurance = await db.insurance_details.findAll({
            where: { common_id },
            include: [
                {
                    model: db.insurance_common_details,
                    as: 'insurance_common_detail',
                    attributes: [
                        'id', 'customer_id', 'segment', 'vehicle_number', 'insurance_type',
                        'segment_vehicle_type', 'segment_vehicle_detail_type', 'model', 'manufacturer', 'fuel_type', 'yom'
                    ]
                }
            ],
            order: [['insurance_count', 'DESC']]
        });

        if (!insurance || insurance.length === 0) {
            return ResponseHandler.notFound(res, 'No insurance found for this common_id');
        }

        return ResponseHandler.success(res, 200, 'Insurance details retrieved successfully', insurance);

    } catch (error) {
        console.error('Error while fetching particular insurance details:', error);
        return ResponseHandler.error(res, 500, 'Error while fetching particular insurance details.', error);
    }
};
