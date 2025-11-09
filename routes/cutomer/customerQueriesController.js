const db = require('../../models');
const ResponseHandler = require('../../utils/responseHandler');


exports.submitUserQueries = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return ResponseHandler.validationError(res, 'Name, email, phone, and message are required.');
        }
        const userQuery = 'INSERT INTO user_queries (name, email, phone, message) VALUES (?, ?, ?, ?)';
        const result = await db.query(userQuery, [name, email, phone, message]);
        return ResponseHandler.success(res, 'User query submitted successfully.', result);
    } catch (error) {
        return ResponseHandler.error(res, 500, 'Failed to submit user query.', error);
    }
}
