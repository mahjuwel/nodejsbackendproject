const errorResponse = (res, { statusCode = 500, message = "Internal Server Error" }) => {
    res.status(statusCode).json({
        success: false,
        message: message
    });
}

const createError = (statusCode = 400, message = "Not Found") => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const successResponse = (res, { statusCode = 200, message = "Success", payload = {} }) => {
    res.status(statusCode).json({
        success: true,
        message: message,
        payload
    });
}

module.exports = { createError, errorResponse, successResponse };