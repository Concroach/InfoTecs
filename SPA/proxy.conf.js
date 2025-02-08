const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  '/api': {
    target: 'https://localhost:44372',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true
  }
};
