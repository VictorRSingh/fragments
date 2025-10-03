
// Successful response returns status: ok

module.exports.createSuccessResponse = function (data) {
    return {
        status: 'ok',
        ...data
    }
}

// Error response returns status: error
module.exports.createErrorResponse = function (code, message) {
    return {
        status: 'error',
        error: {
            code: code,
            message: message,
        }
    };
}