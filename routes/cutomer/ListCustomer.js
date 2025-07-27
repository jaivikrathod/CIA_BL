const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler');
const { Op } = require('sequelize');

exports.listCustomers = async (req, res) => {
    try {
        const { search, gender, admin, minAge, maxAge, page = 1, limit = 10 } = req.body;
        const offset = (page - 1) * limit;
        const limitPlusOne = limit + 1;

        // Build dynamic where clause
        let where = { is_active: 1 };

        // Add user_id filter for non-admin users
        if (req.userType !== 'Admin') {
            const user_id = req.headers['x-user-id'];
            where.user_id = user_id;
        }

        // Add search filter if provided
        if (search && search.trim() !== '') {
            const searchPattern = `%${search}%`;
            where[Op.or] = [
                { full_name: { [Op.like]: searchPattern } },
                { email: { [Op.like]: searchPattern } },
                { primary_mobile: { [Op.like]: searchPattern } },
                { additional_mobile: { [Op.like]: searchPattern } },
                { state: { [Op.like]: searchPattern } },
                { city: { [Op.like]: searchPattern } },
                { full_address: { [Op.like]: searchPattern } }
            ];
        }

        // Add gender filter if provided
        if (gender && gender.trim() !== '') {
            where.gender = gender;
        }

        // Add age range filter if provided
        if (minAge && minAge.trim() !== '' && maxAge && maxAge.trim() !== '') {
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDate();
            const minAgeDate = new Date(currentYear - maxAge, currentMonth, currentDay);
            const maxAgeDate = new Date(currentYear - minAge, currentMonth, currentDay);
            where.dob = { [Op.between]: [minAgeDate, maxAgeDate] };
        }

        if (admin && admin.trim() !== '') {
            where.user_id = admin;
        }

        // Query options
        let queryOptions = {
            where,
            order: [['id', 'DESC']]
        };
        if (limit !== 0) {
            queryOptions.limit = limitPlusOne;
            queryOptions.offset = offset;
        }

        // Fetch customers
        const customers = await db.customers.findAll(queryOptions);

        let isMoreData = false;
        let result = customers;
        if (limit !== 0 && customers.length > limit) {
            isMoreData = true;
            result = customers.slice(0, limit);
        }

        if (result.length === 0) {
            return ResponseHandler.emptyList(res, 'No customers found.', {
                page,
                limit,
                isMoreData: false
            });
        }

        return ResponseHandler.list(res, result, {
            page,
            limit,
            isMoreData
        }, 'Customers retrieved successfully');

    } catch (error) {
        return ResponseHandler.error(res, 500,  error);
    }
};
