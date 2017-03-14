exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.uuid('uuid').primary()
      table.string('email').unique()
      table.string('password_hash')
      table.timestamps()
    }),

    knex.schema.createTable('sessions', (table) => {
      table.string('email')
      table.string('token')
    }),

    knex.schema.createTable('habits', (table) => {
      table.uuid('uuid').primary()
      table.uuid('owner').references('uuid').inTable('users')
      table.string('name')
      table.string('type')
      table.integer('goal')
      table.string('description')
    }),

    knex.schema.createTable('habit_instances', (table) => {
      table.uuid('habit_uuid').references('uuid').inTable('habits')
      table.timestamp('created_at')
    })
  ])
};

exports.down = function(knex, Promise) {

};