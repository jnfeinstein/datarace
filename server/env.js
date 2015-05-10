module.exports = {
  isProduction: function() {
    return process.env.NODE_ENV === 'production';
  },
  isDevelopment: function() {
    return process.env.NODE_ENV === 'development';
  }
}