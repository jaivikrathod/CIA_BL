const db = require('../../config/db');


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
      
        console.log(startDate);
        console.log(endDate);
        
        // SQL query to get monthly insurance counts
        const query = `
            SELECT 
                MONTH(insurance_date) as month,
                COUNT(*) as count
            FROM insurance_details
            WHERE user_id = ?
                AND insurance_date >= ?
                AND insurance_date <= ?
                AND is_active = 1
            GROUP BY MONTH(insurance_date)
            ORDER BY MONTH(insurance_date)
        `;

        const [results] = await db.execute(query, [user_id, startDate, endDate]);

        

        // Create array with all months and initialize count to 0
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = monthNames.map((month, index) => ({
            month,
            count: 0
        }));

        // Update counts from database results
        results.forEach(result => {
            const monthIndex = result.month - 1; // Convert 1-based month to 0-based index
            monthlyData[monthIndex].count = result.count;
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

        // SQL query to get insurance category counts grouped by segment
        const query = `
            SELECT 
                icd.segment,
                COUNT(id.insurance_id) as count
            FROM insurance_details id
            INNER JOIN insurance_common_details icd ON id.insurance_id = icd.id
            WHERE id.user_id = ?
                AND id.is_active = 1
                AND icd.is_active = 1
            GROUP BY icd.segment
            ORDER BY count DESC
        `;

        const [results] = await db.execute(query, [user_id]);

        // Create the response format
        const customerData = {
            labels: [],
            data: []
        };

        // Populate the labels and data arrays
        results.forEach(result => {
            customerData.labels.push(result.segment);
            customerData.data.push(result.count);
        });

        return res.status(200).json({ 
            success: true, 
            data: customerData 
        });
    } catch (error) {
        console.error('Error in getInsuranceCategoryReports:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}