const db = require('../../models');
const bcrypt = require('bcryptjs');
const ResponseHandler = require('../../utils/responseHandler');

const password = 'Password@123';
const saltRounds = 10;

exports.handleAddEditUser = async (req, res) => {
    try {
        const { id, full_name, email, mobile, type } = req.body;

        if (!full_name || !email || !mobile || !type) {
            return ResponseHandler.validationError(res, 'Full name, email, mobile, type are required.');
        }
        if (id) {
            await db.users.update(
                { full_name, email, mobile, type },
                { where: { id } }
            );
            return ResponseHandler.updated(res, 'User updated successfully.');
        } else {
            const existingUser = await db.users.findOne({
                where: {
                    [db.Sequelize.Op.or]: [
                        { email },
                        { mobile }
                    ]
                }
            });
            if (existingUser) {
                return ResponseHandler.conflict(res, 'Email or Mobile number already exists.');
            }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await db.users.create({
                full_name,
                email,
                mobile,
                type,
                password: hashedPassword,
            });
            return ResponseHandler.created(res, 'New user created successfully.');
        }
    } catch (error) {
        console.error('Error in handleUpsertUser:', error);
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
}