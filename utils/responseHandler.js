/**
 * Standardized API Response Handler
 * Provides consistent response structure across all API endpoints
 */

class ResponseHandler {
    /**
     * Success Response
     * @param {Object} res - Express response object
     * @param {number} statusCode - HTTP status code (default: 200)
     * @param {string} message - Success message
     * @param {*} data - Response data
     * @param {Object} pagination - Pagination info (optional)
     */
    static success(res, statusCode = 200, message = 'Success', data = null, pagination = null) {
        const response = {
            success: true,
            message: message,
            timestamp: new Date().toISOString()
        };

        if (data !== null) {
            response.data = data;
        }

        if (pagination !== null) {
            response.pagination = pagination;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Error Response
     * @param {Object} res - Express response object
     * @param {number} statusCode - HTTP status code (default: 500)
     * @param {string} message - Error message
     * @param {*} error - Error details (optional, for debugging)
     */
    static error(res, statusCode = 500, message = 'Internal server error', error = null) {
        const response = {
            success: false,
            message: message,
            timestamp: new Date().toISOString()
        };

        // Only include error details in development environment
        if (process.env.NODE_ENV === 'development' && error) {
            response.error = error;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Validation Error Response
     * @param {Object} res - Express response object
     * @param {string} message - Validation error message
     * @param {Array} errors - Validation errors array (optional)
     */
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

    /**
     * Not Found Response
     * @param {Object} res - Express response object
     * @param {string} message - Not found message
     */
    static notFound(res, message = 'Resource not found') {
        return this.error(res, 404, message);
    }

    /**
     * Unauthorized Response
     * @param {Object} res - Express response object
     * @param {string} message - Unauthorized message
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return this.error(res, 401, message);
    }

    /**
     * Forbidden Response
     * @param {Object} res - Express response object
     * @param {string} message - Forbidden message
     */
    static forbidden(res, message = 'Access forbidden') {
        return this.error(res, 403, message);
    }

    /**
     * Conflict Response
     * @param {Object} res - Express response object
     * @param {string} message - Conflict message
     */
    static conflict(res, message = 'Resource conflict') {
        return this.error(res, 409, message);
    }

    /**
     * Created Response
     * @param {Object} res - Express response object
     * @param {string} message - Created message
     * @param {*} data - Created resource data
     */
    static created(res, message = 'Resource created successfully', data = null) {
        return this.success(res, 201, message, data);
    }

    /**
     * Updated Response
     * @param {Object} res - Express response object
     * @param {string} message - Updated message
     * @param {*} data - Updated resource data
     */
    static updated(res, message = 'Resource updated successfully', data = null) {
        return this.success(res, 200, message, data);
    }

    /**
     * Deleted Response
     * @param {Object} res - Express response object
     * @param {string} message - Deleted message
     */
    static deleted(res, message = 'Resource deleted successfully') {
        return this.success(res, 200, message);
    }

    /**
     * List Response with Pagination
     * @param {Object} res - Express response object
     * @param {Array} data - List data
     * @param {Object} pagination - Pagination info
     * @param {string} message - Success message
     */
    static list(res, data, pagination, message = 'Data retrieved successfully') {
        return this.success(res, 200, message, data, pagination);
    }

    /**
     * Empty List Response
     * @param {Object} res - Express response object
     * @param {string} message - Empty list message
     * @param {Object} pagination - Pagination info
     */
    static emptyList(res, message = 'No data found', pagination = null) {
        return this.success(res, 200, message, [], pagination);
    }
}

module.exports = ResponseHandler; 