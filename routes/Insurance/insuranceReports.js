const db = require('../../models');
const { Op, fn, col, literal } = require('sequelize');

exports.getInsuranceReports = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }

        // Get current date and calculate the date range
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
        const currentYear = currentDate.getFullYear();
        
        // Calculate start date (previous year's May) and end date (current month)
        const startDate = new Date(currentYear - 1, 4, 1); // May of previous year
        const endDate = new Date(currentYear, currentMonth - 1, 0); // Last day of previous month

        // Sequelize query to get monthly insurance counts
        const results = await db.insurance_details.findAll({
            attributes: [
                [fn('MONTH', col('insurance_date')), 'month'],
                [fn('COUNT', col('*')), 'count']
            ],
            where: {
                user_id,
                insurance_date: {
                    [Op.gte]: startDate,
                    [Op.lte]: endDate
                },
                is_active: 1
            },
            group: [fn('MONTH', col('insurance_date'))],
            order: [[fn('MONTH', col('insurance_date')), 'ASC']]
        });

        // Create array with all months and initialize count to 0
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = monthNames.map((month, index) => ({
            month,
            count: 0
        }));

        // Update counts from database results
        results.forEach(result => {
            const monthIndex = (result.get('month') || 0) - 1; // Convert 1-based month to 0-based index
            if (monthIndex >= 0 && monthIndex < 12) {
                monthlyData[monthIndex].count = parseInt(result.get('count'), 10);
            }
        });

        return res.status(200).json({ 
            success: true, 
            data: monthlyData 
        });
    } catch (error) {
        console.error('Error in getInsuranceReports:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}

exports.getInsuranceCategoryReports = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID is required.' });
        }

        // Sequelize query to get insurance category counts grouped by segment
        const results = await db.insurance_details.findAll({
            attributes: [],
            where: {
                user_id,
                is_active: 1
            },
            include: [
                {
                    model: db.insurance_common_details,
                    as: 'insurance_common_detail',
                    attributes: ['segment'],
                    where: { is_active: 1 }
                }
            ]
        });
        // Aggregate counts by segment
        const segmentCounts = {};
        results.forEach(result => {
            const segment = result.insurance_common_detail?.segment || 'Unknown';
            segmentCounts[segment] = (segmentCounts[segment] || 0) + 1;
        });

        // Create the response format
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