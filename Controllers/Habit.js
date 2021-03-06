const uuid = require('uuid/v4');
var Habit = require('../Models/Habit')
const moment = require('moment')
const User = require('../Models/User')

class HabitController {

  constructor(knex) {
    this.knex = knex
  }

  _addHabitInstance(req, res) {
    Habit
      .getHabit(this.knex, req.params.id)
      .then((habit) => {
        let toCreateString = moment(req.body.created_at).format('MMMM Do YYYY')
        let habitInstances = habit.instances.map((hi) => moment(hi.created_at).format('MMMM Do YYYY'))
        if (habitInstances.indexOf(toCreateString) !== -1) throw 'Instance already exists for this date'
        return Habit.addInstance(this.knex, req.params.id, req.body.created_at)
      })
      .then((asd) => res.status(201).json({message: 'created'}))
      .catch((err) => res.status(500).send(err)) 
  }

  _getHabits(req, res) {
    Habit.getHabitsByUser(this.knex, req.user.uuid)
      .then((habits) => res.send(habits))
  }

  _addHabit(req, res) {
    let id = uuid.v4();
    let h = new Habit(id, req.user.uuid, req.body.name, req.body.type, req.body.goal, req.body.description)
    h.saveHabit(this.knex)
      .then((asd) => res.json({token: id}))
      .catch((err) => res.send('nah mon'))
  }

  _getHabit(req, res) {
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
      });
  }

  _deleteInstance(req, res) {
    Habit.getHabitsByUser(this.knex, req.user.uuid)
      .then((habits) => habits.map(h => h.uuid))
      .then((uuids) => {
        if (uuids.indexOf(req.params.uuid) !== -1) {
          Habit
            .removeInstance(this.knex, req.params.uuid, req.body.created_at)
            .then(() => res.json({message: 'yup'}))
        } else {
          res.status(400).send({message: 'Too bad this aint yours'})
        }
      })
      .catch((e) => console.log)
  }

  loadRoutes(app) {
    app.post('/habits', this._addHabit.bind(this));
    app.post('/habits/:id/instance', this._addHabitInstance.bind(this));
    app.get('/habits', this._getHabits.bind(this));

    app.get('/habits/:id', this._getHabit.bind(this));
    app.delete('/habits/:uuid/instances', this._deleteInstance.bind(this));

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


    app.post('/habit_pools', (req, res) => {
      let self = this
      if (req.user && req.body.target) {
        User.findByEmail(self.knex, req.body.target)
          .then((users) => {
            let u = users[0]
            this.mark = u;
            this.mark.habitUuid = uuid.v4()
            let h = new Habit(this.mark.habitUuid, u.uuid, req.body.habit.name, req.body.habit.type, req.body.habit.goal, req.body.habit.description)
            return h.saveHabit(self.knex)
          })
          .then(() => {
            User
            .findByEmail(self.knex, req.body.target)
            .then((users) => {
              let creates = users.map(user => Habit.createPool(self.knex))
              self.users = users.concat(req.user)
              return Promise.all(creates)
            })
            .then((uuids) => uuids.reduce((acc, val) => acc.concat(val), []))
            .then((uuids) => {
              console.log(self.users)
              console.log(uuids[0])
              let promises = [
                Habit.addParticipantToPool(self.knex, this.mark.uuid, this.mark.habitUuid, uuids[0]),
                Habit.addParticipantToPool(self.knex, req.user.uuid, req.body.habit.uuid, uuids[0])
              ]
              return Promise.all(promises)
            })
            .then((answ) => {
              console.log(answ)
              console.log("foofa")
              res.json(answ)
            })
            .catch((e) => console.log)
      })
    }
  })
  }

}

module.exports = HabitController