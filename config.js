module.exports = {
  development: {
    knex: {
      client: 'postgres',
      connection: {
        host : 'localhost',
        user : 'postgres',
        password : 'foobar',
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
