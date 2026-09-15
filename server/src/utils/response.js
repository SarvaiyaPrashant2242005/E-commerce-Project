
const successResponse = (code, message, messageToShow, data = null) => ({
    success: true,
    code,
    message,
    messageToShow,
    data,
});

const errorResponse = (errorCode, errorMessage, messageToShow) => ({
    success: false,
    errorCode,
    errorMessage,
    messageToShow,
});

module.exports = {
    successResponse,
    errorResponse,
};
