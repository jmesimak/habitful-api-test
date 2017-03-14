var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var UserController = require('./Controllers/User')
var HabitController = require('./Controllers/Habit')
var User = require('./Models/User')
var knexConfig = require('./config')[process.env.NODE_ENV].knex

var knex = require('knex')(knexConfig);

app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
  next();
});

app.set('port', (process.env.PORT || 3000));

app.use((req, res, next) => {
  if (req.headers.token) {
    User.findBySessionToken(knex, req.headers.token)
      .then((users) => {
        let u = users[0]
        req.user = u
        next()
      })
      .catch((exception) => {
        res.send(exception)
      })
  } else {
    next()
  }
})

var uc = new UserController(knex)
uc.loadRoutes(app)


var hc = new HabitController(knex)
hc.loadRoutes(app)

app.get('/', function (req, res) {
  res.send('Hello World!\n')
})

app.listen(app.get('port'), function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app