
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('goals', (table) => {
      table.uuid('owner').references('uuid').inTable('users')
    })
  ])
};

exports.down = function(knex, Promise) {

};
