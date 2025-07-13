const db = require('../models');
const ResponseHandler = require('../utils/responseHandler');

exports.handleTokenVerification = async (req, res) => {
    try {
        const user = await db.users.findOne({
            where: { id: req.headers['x-user-id'] },
            attributes: ['type', 'full_name']
        });
        if (!user) {
            return ResponseHandler.unauthorized(res, 'user not found');
        }
        const { type, full_name } = user;
        return ResponseHandler.success(res, 200, 'Token verified successfully.', { full_name, type });
    } catch (error) {
        return ResponseHandler.error(res, 500, 'An error occurred during token verification.', error);
    }
};
