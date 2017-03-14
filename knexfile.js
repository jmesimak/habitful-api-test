var knexConfig = require('./config')[process.env.NODE_ENV]

module.exports = {
  development: knexConfig,
  production: knexConfig
};
