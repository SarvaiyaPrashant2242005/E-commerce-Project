const formatSuccess = (data, message = 'Operation successful', extra = {}) => ({
  success: true,
  code: 200,
  message,
  messageToShow: message,
  data,
  ...extra,
});

const formatError = (code, message, errorCode = 'ERROR') => ({
  success: false,
  code,
  errorCode,
  errorMessage: message,
  messageToShow: message,
});

module.exports = {
  formatSuccess,
  formatError,
};
