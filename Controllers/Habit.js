const uuid = require('uuid/v4');
var Habit = require('../Models/Habit')

class HabitController {

  constructor(knex) {
    this.knex = knex
  }

  loadRoutes(app) {
    app.post('/habits', (req, res) => {
      console.log(req.user)
      console.log(req.body)
      let h = new Habit(uuid.v4(), req.user.uuid, req.body.name, req.body.type, req.body.goal, req.body.description)
      h.saveHabit(this.knex)
        .then((asd) => res.send('yah mon'))
        .catch((err) => res.send('nah mon'))
    })

    app.post('/habits/:id/instance', (req, res) => {
      console.log(req.params)
      console.log(req.body)
      Habit.addInstance(this.knex, req.params.id, req.body.created_at)
        .then((asd) => res.send('yah'))
        .catch((err) => res.send(err))
    })

    app.get('/habits', (req, res) => {
      Habit.getHabitsByUser(this.knex, req.user.uuid)
        .then((habits) => res.send(habits))
    })
  }

}

module.exports = HabitController