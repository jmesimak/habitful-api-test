
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('goals', (table) => {
      table.uuid('uuid').primary()
      table.string('name').notNullable()
      table.string('description')
      table.timestamp('created_at').notNullable()
      table.timestamp('completed_at')
    }),

    knex.schema.table('habits', (table) => {
      table.dropColumn('description')
      table.boolean('inactive').defaultTo(false)
    })
  ])
};

exports.down = function(knex, Promise) {

};
