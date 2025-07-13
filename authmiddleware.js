const db = require('./models');
const ResponseHandler = require('./utils/responseHandler');

exports.validateUser = async (req, res, next) => {
    const token = req.headers['authorization'];
    const userId = req.headers['x-user-id'];
    
    if (!token || !userId) {
        return ResponseHandler.unauthorized(res, 'Authorization token and user ID are required.');
    }
    console.log(token);
    console.log(userId);
    

    try {
        const tokenRow = await db.tokens.findOne({ where: { user_id: userId, token } });
        if (!tokenRow) {
            return ResponseHandler.unauthorized(res, 'Invalid token or user ID.');
        }

        const user = await db.users.findOne({ where: { id: userId }, attributes: ['type'] });
        if (!user) {
            return ResponseHandler.unauthorized(res, 'User not found.');
        }
        
        req.userType = user.type;
        req.userID = userId;
        
        next();
    } catch (err) {
        return ResponseHandler.error(res, 500, 'An internal server error occurred.' +err);
    }
}