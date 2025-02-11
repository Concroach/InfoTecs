const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = {
  '/api': {
    target: 'http://api:44372',
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: { '^/api': '' }
  }
};
