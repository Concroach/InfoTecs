const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = {
  '/api': {
    target: 'http://api:44372', // Используем имя сервиса из docker-compose.yml
    secure: false,
    logLevel: 'debug',
    changeOrigin: true
  }
};
