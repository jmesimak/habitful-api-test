module.exports = {
  development: {
    knex: {
      client: 'postgres',
      connection: {
        host : 'db',
        user : 'postgres',
        password : 'puikula',
        database : 'habitful'
      }
    }
  },

  production: {
    knex: {
      client: 'postgres',
      connection: {
        host : process.env.DB_HOST || '',
        user : process.env.DB_USER || '',
        password : process.env.DB_PASSWORD || '',
        database : process.env.DB_DATABASE || ''
      }
    }
  }
};
