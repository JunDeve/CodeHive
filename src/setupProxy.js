const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/relatedQueries',
    createProxyMiddleware({
      target: 'https://asia-northeast3-powerful-anchor-405101.cloudfunctions.net',
      changeOrigin: true,
    })
  );
};
