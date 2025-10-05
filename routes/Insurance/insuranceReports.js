const db = require('../../models');
const { Op, fn, col, literal } = require('sequelize');

exports.getInsuranceReports = async (req, res) => {
    try {
        const { user_id, entity_type = 'user', entity_id, preset, start_date, end_date, detailed = false } = req.query;
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }

        const now = new Date();
        let rangeStart;
        let rangeEnd;

        const toDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

        if (preset && preset !== 'custom') {
            const end = toDateOnly(now);
            let start = new Date(end);
            switch (preset) {
                case 'this_month':
                    start = new Date(end.getFullYear(), end.getMonth(), 1);
                    break;
                case '2m':
                    start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
                    break;
                case '3m':
                    start = new Date(end.getFullYear(), end.getMonth() - 2, 1);
                    break;
                case '6m':
                    start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
                    break;
                case '1y':
                    start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
                    break;
                case 'all':
                    break;
                default:
                    start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
            }

            if (preset === 'this_month') {
                rangeEnd = new Date(end.getFullYear(), end.getMonth() + 1, 0);
            } else {
                rangeEnd = end;
            }
            rangeStart = start;
        } else if (start_date && end_date) {
            rangeStart = new Date(start_date);
            rangeEnd = new Date(end_date);
        } else {
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            rangeStart = new Date(currentYear, currentMonth - 11, 1);
            rangeEnd = new Date(currentYear, currentMonth + 1, 0);
        }

        const noDateFilter = preset === 'all';
        const whereClause = { is_active: 1 };
        if (!noDateFilter) {
            whereClause.insurance_date = { [Op.gte]: rangeStart, [Op.lte]: rangeEnd };
        }

        if (entity_type === 'agent' && entity_id) {
            whereClause.agent_id = entity_id;
            whereClause.case_type = 'agent';
        } else if (entity_type === 'user') {

            if (entity_id) {
                whereClause.user_id = entity_id;
            } else {
                whereClause.user_id = user_id;
            }
            whereClause.case_type = 'office';
        }

        const results = await db.insurance_details.findAll({
            attributes: [
                [fn('DATE_FORMAT', col('insurance_date'), '%Y-%m'), 'ym'],
                [fn('COUNT', col('*')), 'count']
            ],
            where: whereClause,
            group: [literal("DATE_FORMAT(insurance_date, '%Y-%m')")],
            order: [[literal("DATE_FORMAT(insurance_date, '%Y-%m')"), 'ASC']]
        });

        const ymToCount = new Map();
        results.forEach(r => {
            ymToCount.set(r.get('ym'), parseInt(r.get('count'), 10) || 0);
        });

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = [];
        let cursor;
        let endCursor;
        if (!noDateFilter) {
            cursor = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
            endCursor = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), 1);
        } else if (ymToCount.size > 0) {
            const yms = Array.from(ymToCount.keys()).sort();
            const [minYm, maxYm] = [yms[0], yms[yms.length - 1]];
            const [minY, minM] = minYm.split('-').map(Number);
            const [maxY, maxM] = maxYm.split('-').map(Number);
            cursor = new Date(minY, minM - 1, 1);
            endCursor = new Date(maxY, maxM - 1, 1);
        } else {
            cursor = new Date(now.getFullYear(), now.getMonth(), 1);
            endCursor = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        while (cursor <= endCursor) {
            const ymKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`;
            data.push({
                month: `${monthNames[cursor.getMonth()]} ${String(cursor.getFullYear()).slice(-2)}`,
                count: ymToCount.get(ymKey) || 0
            });
            cursor.setMonth(cursor.getMonth() + 1);
        }

        const insuranceCount = await db.insurance_details.count({ where: whereClause });

        const packagePremium = await db.insurance_details.sum('package_premium', {
            where: whereClause
        });
        const premium = await db.insurance_details.sum('premium', {
            where: whereClause
        });
        const amount = await db.insurance_details.sum('amount', {
            where: whereClause
        });
         const od_premium = await db.insurance_details.sum('od_premium', {
            where: whereClause
        });
          const tp_premium = await db.insurance_details.sum('tp_premium', {
            where: whereClause
        });
         const gst = await db.insurance_details.sum('gst', {
            where: whereClause
        });
        const net_payout_percent = await db.insurance_details.sum('net_payout_percent', {
            where: whereClause
        });
        const net_amount = await db.insurance_details.sum('net_amount', {
            where: whereClause
        });
        const net_income = await db.insurance_details.sum('net_income', {
            where: whereClause
        });
        const payout_percent = await db.insurance_details.sum('payout_percent', {
            where: whereClause
        });

        let usersCount;
        usersCount = await db.users.count({ where: { is_active: 1 } });

        let customersCount;
        const customersWhere = { is_active: 1 };
        if (!noDateFilter) {
            customersWhere.created_at = { [Op.gte]: rangeStart, [Op.lte]: rangeEnd };
        }
        if (entity_id) {
            customersWhere.user_id = entity_id;
        }
        customersCount = await db.customers.count({ where: customersWhere });

        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        let newCustomersCount;
        const newCustomersWhere = { created_at: { [db.Sequelize.Op.gte]: fiveDaysAgo }, is_active: 1 };
        if (entity_id) {
            newCustomersWhere.user_id = entity_id;
        }
        newCustomersCount = await db.customers.count({
            where: newCustomersWhere
        });

        let agentsCount;
        agentsCount = await db.agents.count({ where: { is_active: 1 } });

        // If detailed data is requested, fetch detailed insurance records
        let detailedData = null;
        if (detailed === 'true' || detailed === true) {
            const detailedResults = await db.insurance_details.findAll({
                where: whereClause,
                include: [
                    {
                        model: db.insurance_common_details,
                        as: 'insurance_common_detail',
                        attributes: [
                            'customer_id', 'segment', 'vehicle_number', 'insurance_type',
                            'segment_vehicle_type', 'segment_vehicle_detail_type', 'model', 
                            'manufacturer', 'fuel_type', 'yom'
                        ],
                        include: [
                            {
                                model: db.customers,
                                as: 'customer',
                                attributes: ['full_name', 'email', 'primary_mobile', 'dob']
                            }
                        ]
                    }
                ],
                order: [['insurance_date', 'DESC']]
            });
            // return res.json(detailedResults);

            // Format the detailed data
            detailedData = detailedResults.map(result => {
                const record = result.toJSON();
                const commonDetail = record.insurance_common_detail;
                const customer = commonDetail?.customer;
                
                // Calculate age from DOB
                let age = null;
                if (customer?.dob) {
                    const dobDate = new Date(customer.dob);
                    const diff = Date.now() - dobDate.getTime();
                    const ageDate = new Date(diff);
                    age = Math.abs(ageDate.getUTCFullYear() - 1970);
                }

                return {
                    customer_name: customer?.full_name || '',
                    email: customer?.email || '',
                    mobile: customer?.primary_mobile || '',
                    dob: customer?.dob || '',
                    age: age,
                    vehicle_number: commonDetail?.vehicle_number || '',
                    insurance_type: commonDetail?.insurance_type || '',
                    segment: commonDetail?.segment || '',
                    manufacturer: commonDetail?.manufacturer || '',
                    model: commonDetail?.model || '',
                    fuel_type: commonDetail?.fuel_type || '',
                    yom: commonDetail?.yom || '',
                    policy_start_date: record.policy_start_date || '',
                    policy_expiry_date: record.policy_expiry_date || '',
                    insurance_date: record.insurance_date || '',
                    insurance_count: record.insurance_count || '',
                    packagePremium:record.package_premium,
                    premium:record.premium,
                    amount:record.amount,
                    od_premium:record.od_premium || 0,
                    tp_premium:record.tp_premium || 0,
                    gst:record.gst || 0,
                    net_payout_percent:record.net_payout_percent || 0,
                    net_amount:record.net_amount || 0,
                    net_income:record.net_income || 0,
                    payout_percent:record.payout_percent || 0
                };
            });
        }

        const responseData = {
            success: true,
            data,
            counts: {
                users: usersCount,
                customers: customersCount,
                insurance: insuranceCount,
                newCustomers: newCustomersCount,
                agents: agentsCount
            },
            insurance_data:{
                packagePremium:packagePremium,
                premium:premium,
                amount:amount,
                od_premium:od_premium || 0,
                tp_premium:tp_premium || 0,
                gst:gst || 0,
                net_payout_percent:net_payout_percent || 0,
                net_amount:net_amount || 0,
                net_income:net_income || 0,
                payout_percent:payout_percent || 0
            }
        };

        // Add detailed data if requested
        if (detailedData) {
            responseData.detailed_data = detailedData;
        }

        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error in getInsuranceReports:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}

exports.getInsuranceCategoryReports = async (req, res) => {
    try {
        const { user_id, entity_type = 'user', entity_id, preset, start_date, end_date } = req.query;
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }

        const now = new Date();
        let rangeStart;
        let rangeEnd;
        if (preset && preset !== 'custom') {
            const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let start = new Date(end);
            switch (preset) {
                case 'this_month':
                    start = new Date(end.getFullYear(), end.getMonth(), 1);
                    break;
                case '2m':
                    start = new Date(end.getFullYear(), end.getMonth() - 1, 1);
                    break;
                case '3m':
                    start = new Date(end.getFullYear(), end.getMonth() - 2, 1);
                    break;
                case '6m':
                    start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
                    break;
                case '1y':
                    start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
                    break;

                case 'all':
                    break;
                default:
                    start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
            }
            rangeStart = start;
            rangeEnd = end;
        } else if (start_date && end_date) {
            rangeStart = new Date(start_date);
            rangeEnd = new Date(end_date);
        } else {
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            rangeStart = new Date(currentYear, currentMonth - 11, 1);
            rangeEnd = new Date(currentYear, currentMonth + 1, 0);
        }

        const noDateFilterCat = preset === 'all';
        const whereClause = { is_active: 1 };
        if (!noDateFilterCat) {
            whereClause.insurance_date = { [Op.gte]: rangeStart, [Op.lte]: rangeEnd };
        }
        if (entity_type === 'agent' && entity_id) {
            whereClause.agent_id = entity_id;
            whereClause.case_type = 'agent';
        } else if (entity_type === 'user') {
            whereClause.user_id = entity_id || user_id;
            whereClause.case_type = 'office';
        }

        const results = await db.insurance_details.findAll({
            attributes: [],
            where: whereClause,
            include: [
                {
                    model: db.insurance_common_details,
                    as: 'insurance_common_detail',
                    attributes: ['segment'],
                    where: { is_active: 1 }
                }
            ]
        });

        const segmentCounts = {};
        results.forEach(result => {
            const segment = result.insurance_common_detail?.segment || 'Unknown';
            segmentCounts[segment] = (segmentCounts[segment] || 0) + 1;
        });

        const customerData = {
            labels: Object.keys(segmentCounts),
            data: Object.values(segmentCounts)
        };

        return res.status(200).json({
            success: true,
            data: customerData
        });
    } catch (error) {
        console.error('Error in getInsuranceCategoryReports:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' + error });
    }
}