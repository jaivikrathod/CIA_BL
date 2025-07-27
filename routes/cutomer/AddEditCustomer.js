const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler');

exports.handleAddEditCustomer = async (req, res) => {
    try {
        const { id, full_name, email, primary_mobile, additional_mobile, dob, gender, state, city, full_address } = req.body;

        if (!full_name || !email || !primary_mobile || !gender || !dob || !state || !city || !full_address) {
            return ResponseHandler.validationError(res, 'Full name, email, primary mobile, gender, state, city, and full address are required.');
        }

        const user_id = req.headers['x-user-id'];
        // Check if the email or primary mobile already exists in the database
        const check = await db.customers.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { email },
                    { primary_mobile }
                ],
                id: { [db.Sequelize.Op.ne]: id || 0 }
            }
        });
        if (check) {
            return ResponseHandler.conflict(res, 'Email or primary mobile already exists.');
        }

        let response;
        let customerId;
        if (!id) {
            response = await db.customers.create({
                user_id,
                full_name,
                email,
                primary_mobile,
                additional_mobile,
                dob,
                gender,
                state,
                city,
                full_address,
                documents: ''
            });
            customerId = response.id;
        } else {
            response = await db.customers.update({
                full_name,
                email,
                primary_mobile,
                additional_mobile,
                dob,
                gender,
                state,
                city,
                full_address
            }, {
                where: { id }
            });
            customerId = id;
        }

        if ((Array.isArray(response) && response[0] === 0) || (!Array.isArray(response) && !response)) {
            return ResponseHandler.error(res, 500, 'Failed to add or update customer.');
        }

        // Fetch the created or updated customer
        const customerData = await db.customers.findByPk(customerId);

        return id 
            ? ResponseHandler.updated(res,'Customer updated successfully.', customerData,{'isUpdate':true}) 
            : ResponseHandler.created(res,'New customer created successfully.', customerData,{'isUpdate':false});

    } catch (error) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred:-'+ error);
    }
};

