
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('habit_pools', (table) => {
      table.uuid('uuid').primary()
      table.string('name').notNullable()
    }),
    knex.schema.createTable('habit_pool_participants', (table) => {
      table.uuid('participant').references('uuid').inTable('users')
      table.uuid('habit').references('uuid').inTable('habits')
    })
  ])

};

exports.down = function(knex, Promise) {

};
