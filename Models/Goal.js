class Goal {
  static save(knex, goal) {
    return knex('goals')
      .insert(goal)
  }
}

module.exports = Goal