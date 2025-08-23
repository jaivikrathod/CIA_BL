const ResponseHandler = require('./utils/responseHandler');

exports.requireAdmin = (req, res, next) => {
    if (!req.userType) {
        return ResponseHandler.unauthorized(res, 'User authentication required.');
    }

    if (req.userType !== 'Admin') {
        return ResponseHandler.forbidden(res, 'Admin access required.');
    }

    next();
};
