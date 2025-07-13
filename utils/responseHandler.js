class ResponseHandler {

    static success(res, statusCode = 200, message = 'Success', data = null, pagination = null,extras={}) {
        const response = {
            success: true,
            message: message,
            extras
        };

        if (data !== null) {
            response.data = data;
        }

        if (pagination !== null) {
            response.pagination = pagination;
        }
        
        return res.json(response);
    }

    static error(res, statusCode = 500, message = 'Internal server error', error = null) {
        const response = {
            success: false,
            message: message,
            timestamp: new Date().toISOString()
        };

        if (process.env.NODE_ENV === 'development' && error) {
            response.error = error;
        }

        return res.status(statusCode).json(response);
    }

    static validationError(res, message = 'Validation failed', errors = null) {
        const response = {
            success: false,
            message: message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(400).json(response);
    }

    static notFound(res, message = 'Resource not found') {
        return this.error(res, 404, message);
    }

    static unauthorized(res, message = 'Unauthorized access') {
        return this.error(res, 401, message);
    }

    static forbidden(res, message = 'Access forbidden') {
        return this.error(res, 403, message);
    }

  
    static conflict(res, message = 'Resource conflict') {
        return this.error(res, 409, message);
    }

    static created(res,message = 'Resource created successfully', data = null,pagination='',extras) {
        return this.success(res,201, message, data,pagination,extras);
    }

    static updated(res,message = 'Resource updated successfully', data = null,extras) {
        return this.success(res,200, message, data,'',extras);
    }

    static deleted(res, message = 'Resource deleted successfully') {
        return this.success(res, 200, message);
    }

    static list(res, data, pagination, message = 'Data retrieved successfully') {
        return this.success(res, 200, message, data, pagination);
    }

    static emptyList(res, message = 'No data found', pagination = null) {
        return this.success(res, 200, message, [], pagination);
    }
}

module.exports = ResponseHandler; 