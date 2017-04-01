var knexConfig = require('./config')[process.env.NODE_ENV].knex

module.exports = {
  development: knexConfig,
  production: knexConfig
};
