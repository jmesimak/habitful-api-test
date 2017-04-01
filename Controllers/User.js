var User = require('../Models/User')
var Goal = require('../Models/Goal')
var bcrypt = require('bcryptjs');
const uuid = require('uuid/v4');

class UserController {
  constructor(knex) {
    this.knex = knex;
    this.loadRoutes = this.loadRoutes.bind(this)
  }

  loadRoutes(app) {
    app.post('/users', (req, res) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          let u = new User(null, req.body.email, null, hash)
          u.saveUser(this.knex)
            .then((uuid) => {
              u.uuid = uuid[0]
              return u.authenticate(this.knex)
            })
            .then((token) => {
              res.send({token: token[0]})
            })
        });
      });
    })

    app.post('/users/sessions', (req, res) => {
      User.findByEmail(this.knex, req.body.email)
        .then((users) => {
          if (users.length === 0) throw 'No such user'
          let u = new User(null, users[0].email, req.body.password, users[0].password_hash)
          return u.logIn(this.knex)
        })
        .then((token) => {
          res.send({token: token[0]})
        })
        .catch((err) => {
          console.log(err)

          res.status(403).json(err)
        })
    })

    app.get('/users/sessions', (req, res) => {
      if (req.user) {
        res.send('aye mate')
      } else {
        res.send('nope, not happenings')
      }
    })

    app.post('/goals', (req, res) => {
      if (req.user) {
        req.body.owner = req.user.uuid
        req.body.uuid = uuid.v4()
        req.body.created_at = new Date()
        Goal
          .save(this.knex, req.body)
          .then(() => res.json({message: 'brah'}))
          .catch(() => res.statu(500).json({message: 'error bro'}))
      } else {
        res.status(403).json({message: 'plz login'})
      }
    })

    app.get('/goals', (req, res) => {
      if (req.user) {
        User.getGoals(this.knex, req.user.uuid)
          .then((goals) => res.send(goals))
          .catch((e) => res.send(e))
      } else {
        res.status(403).json({message: 'eyyy mon no user mon :D'})
      }
    })

    app.put('/goals/:id/done', (req, res) => {
      if (req.user) {
        User.setGoalAsDone(this.knex, req.user.uuid, req.params.id)
          .then(() => res.json({message: 'yes'}))
          .catch(() => res.status(403).json({message: 'asdasdasd'}))
      } else {
        res.status(403).json({message: 'eyyy mon no user mon :D'})
      }
    })

  }
}

module.exports = UserController