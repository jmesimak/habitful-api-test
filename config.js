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
        host : '',
        user : '',
        password : '',
        database : ''
      }
    }
  }
};
