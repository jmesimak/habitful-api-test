
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('habit_pool_participants', (table) => {
      table.uuid('pool').references('uuid').inTable('habit_pools')
    })
  ])
};

exports.down = function(knex, Promise) {

};
