var User = require('../Models/User')
var bcrypt = require('bcryptjs');

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
      console.log(req.body)
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
          res.send(err)
        })
    })

    app.get('/users/sessions', (req, res) => {
      if (req.user) {
        res.send('aye mate')
      } else {
        res.send('nope, not happenings')
      }
    })

  }
}

module.exports = UserController