
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('habits', (table) => {
      table.text('description')
    }),

    knex.schema.table('goals', (table) => {
      table.dropColumn('description')
    })
  ])
};

exports.down = function(knex, Promise) {

};
