class Habit {

  constructor(uuid, owner, name, type, goal, description) {
    this.uuid = uuid
    this.owner = owner
    this.name = name
    this.type = type
    this.goal = goal
    this.description = description
  }

  saveHabit(knex) {
    return knex('habits')
      .insert(this)
  }

  static addInstance(knex, id, created_at) {
    return knex('habit_instances')
      .insert({habit_uuid: id, created_at: new Date(created_at)})
  }

  static getHabitsByUser(knex, user_uuid) {
    return new Promise((resolve, reject) => {
      return knex('habits')
        .where({owner: user_uuid})
        .then((habits) => {
          this.habits = habits;
          let promises = habits.map((h) => {
            return knex('habit_instances')
              .where({habit_uuid: h.uuid})
          })
          return Promise.all(promises)
        })
        .then((habitInstanceArray) => {
          this.habits.forEach((h) => {
            h.instances = habitInstanceArray
            .filter((habitInstances) => (habitInstances.length > 0 && habitInstances[0].habit_uuid === h.uuid))
            .reduce((acc, cur) => acc.concat(cur), [])
          })
          resolve(this.habits)
        })
    })
  }

  static getHabit(knex, uuid) {
    return knex('habits')
      .where({uuid: uuid})
      .then((habits) => {
        this.habit = habits[0]
        return knex('habit_instances').where({habit_uuid: this.habit.uuid})
      })
      .then((habitInstances) => {
        this.habit.instances = habitInstances
        return this.habit
      })
  }

  static delete(knex, uuid) {
    return knex('habit_instances')
      .where({habit_uuid: uuid})
      .del()
      .then(() => knex('habits').where({uuid: uuid}).del())
  }

  static removeInstance(knex, habit_uuid, instance_time) {
    return knex('habit_instances')
      .where({habit_uuid: habit_uuid, created_at: instance_time})
      .del()
  }

}

module.exports = Habit