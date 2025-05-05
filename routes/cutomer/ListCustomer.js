const db = require('../../config/db');

exports.listCustomers = async (req, res) => {
    try {
        const { search, gender, minAge, maxAge, page = 1, limit = 10 } = req.body;
        const adminType = req.headers['admintype'];

        const offset = (page - 1) * limit;
        const limitPlusOne = limit + 1;

        let query = 'SELECT * FROM customer WHERE 1=1';
        const params = [];

        // Add user_id filter for non-admin users
        if (adminType !== 'Admin') {
            const user_id = req.headers['x-user-id'];
            query += ' AND user_id = ?';
            params.push(user_id);
        }

        // Add search filter if provided
        if (search && search.trim() !== '') {
            query += ' AND (full_name LIKE ? OR email LIKE ? OR primary_mobile LIKE ? OR additional_mobile LIKE ? OR state LIKE ? OR city LIKE ? OR full_address LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        }

        // Add gender filter if provided
        if (gender && gender.trim() !== '') {
            query += ' AND gender = ?';
            params.push(gender);
        }

        // Add age range filter if provided
        if (minAge && minAge.trim() !== '' && maxAge && maxAge.trim() !== '') {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDate();

            const minAgeDate = new Date(currentYear - maxAge, currentMonth, currentDay);
            const maxAgeDate = new Date(currentYear - minAge, currentMonth, currentDay);
            query += ' AND dob BETWEEN ? AND ?';
            params.push(minAgeDate.toISOString().split('T')[0], maxAgeDate.toISOString().split('T')[0]);
        }

        // Add pagination (fetch one extra record)
        query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        params.push(limitPlusOne, offset);

        console.log('Final Query:', query);
        console.log('Query Parameters:', params);

        const [customers] = await db.execute(query, params);

        let isMoreData = false;
        if (customers.length > limit) {
            isMoreData = true;
            customers.pop(); // Remove the extra record
        }

        if (customers.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No customers found.',
                data: [],
                pagination: {
                    page,
                    limit,
                    isMoreData: false
                }
            });
        }

        // Format DOB and calculate age
        customers.forEach(customer => {
            if (customer.dob && !isNaN(new Date(customer.dob).getTime())) {
                const dobDate = new Date(customer.dob);
                customer.dob = dobDate.toISOString().split('T')[0];
                const diff = Date.now() - dobDate.getTime();
                const ageDate = new Date(diff);
                customer.age = Math.abs(ageDate.getUTCFullYear() - 1970);
            } else {
                customer.dob = null;
                customer.age = null;
            }
        });

        return res.status(200).json({
            success: true,
            data: customers,
            pagination: {
                page,
                limit,
                isMoreData
            }
        });

    } catch (error) {
        console.error('Error in listCustomers:', error);
        return res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
};
