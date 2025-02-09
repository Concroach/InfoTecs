const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = {
  '/api': {
    target: 'http://api:44372', // Адрес backend'а внутри Docker-сети
    secure: false,
    logLevel: 'debug',
    changeOrigin: true,
    pathRewrite: { '^/api': '' } // Убираем префикс /api
  }
};
