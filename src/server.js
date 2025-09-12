const stoppable = require('stoppable');
const logger = require('./logger');
const app = require('./app');
const port = parseInt(process.env.PORT || '8080', 10);

// Print Environment Variables in debug mode
if (process.env.LOG_LEVEL === 'debug') {
  console.log('Environment Variables:', process.env);
}

const server = stoppable(
  app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
  })
);

module.exports = server;
