const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler'); 

exports.handleDeleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return ResponseHandler.validationError(res, 'User ID is required for deletion.');
        }

        const [affectedRows] = await db.users.update(
            { is_active: 0 },
            { where: { id } }
        );

        if (affectedRows === 0) {
            return ResponseHandler.notFound(res, 'User not found.');
        }

        return ResponseHandler.deleted(res, 'User deactivated successfully.');
    } catch (error) {
        console.error('Error in handleDeleteUser:', error);
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};
