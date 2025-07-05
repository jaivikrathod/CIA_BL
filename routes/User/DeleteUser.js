const db = require('../../config/db');
const ResponseHandler = require('../../utils/responseHandler'); 


exports.handleDeleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return ResponseHandler.validationError(res, 'User ID is required for deletion.');
        }

        const updateQuery = 'UPDATE users SET is_active = 0 WHERE id = ?';
        const [updateResult] = await db.execute(updateQuery, [id]);

        if (updateResult.affectedRows === 0) {
            return ResponseHandler.notFound(res, 'User not found.');
        }

        return ResponseHandler.deleted(res, 'User deactivated successfully.');
    } catch (error) {
        console.error('Error in handleDeleteUser:', error);
        return ResponseHandler.error(res, 500, 'An internal server error occurred.', error);
    }
};
