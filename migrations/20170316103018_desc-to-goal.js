
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('goals', (table) => {
      table.text('description')
    })
  ])
};

exports.down = function(knex, Promise) {

};
