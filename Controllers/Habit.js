const uuid = require('uuid/v4');
var Habit = require('../Models/Habit')

class HabitController {

  constructor(knex) {
    this.knex = knex
  }

  loadRoutes(app) {
    app.post('/habits', (req, res) => {
      let h = new Habit(uuid.v4(), req.user.uuid, req.body.name, req.body.type, req.body.goal, req.body.description)
      h.saveHabit(this.knex)
        .then((asd) => res.send('yah mon'))
        .catch((err) => res.send('nah mon'))
    })

    app.post('/habits/:id/instance', (req, res) => {
      Habit.addInstance(this.knex, req.params.id, req.body.created_at)
        .then((asd) => res.send('yah'))
        .catch((err) => res.send(err))
    })

    app.get('/habits', (req, res) => {
      console.log(req.user)
      Habit.getHabitsByUser(this.knex, req.user.uuid)
        .then((habits) => res.send(habits))
    })

    app.get('/habits/:id', (req, res) => {
      Habit.getHabit(this.knex, req.params.id)
        .then((habit) => {
          if (habit.owner === req.user.uuid) {
            res.json(habit)
          } else {
            res.status(403).json({message: 'Up yours'})
          }
        })
        .catch((error) => {
          res.status(500).json({something: 'went wrong'})
        })
    })

    app.delete('/habits/:uuid', (req, res) => {
      Habit.getHabitsByUser(this.knex, req.user.uuid)
        .then((habits) => habits.map(h => h.uuid))
        .then((uuids) => {
          if (uuids.indexOf(req.params.uuid) !== -1) {
            Habit
              .delete(this.knex, req.params.uuid)
              .then(() => res.send({message: 'yup'}))
          } else {
            res.status(400).send({message: 'Too bad this aint yours'})
          }
        })
        .catch((e) => console.log)
    })

    app.delete('/habits/:uuid/instances', (req, res) => {
      Habit.getHabitsByUser(this.knex, req.user.uuid)
        .then((habits) => habits.map(h => h.uuid))
        .then((uuids) => {
          if (uuids.indexOf(req.params.uuid) !== -1) {
            Habit
              .removeInstance(this.knex, req.params.uuid, req.body.created_at)
              .then(() => res.send({message: 'yup'}))
          } else {
            res.status(400).send({message: 'Too bad this aint yours'})
          }
        })
        .catch((e) => console.log)
    })
  }

}

module.exports = HabitController