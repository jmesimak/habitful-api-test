const uuid = require('uuid/v4');
var bcrypt = require('bcryptjs');

class User {

  constructor(uuid, email, password, password_hash) {
    this.uuid = uuid
    this.email = email
    this.password = password
    this.password_hash = password_hash
  }

  saveUser(knex) {
    return knex('users')
      .returning('uuid')
      .insert({
        uuid: uuid.v4(),
        email: this.email,
        password_hash: this.password_hash,
        created_at: new Date()
      })
  }

  logIn(knex) {
    let u = this
    return new Promise((resolve, reject) => {
      bcrypt
        .compare(this.password, this.password_hash, (err, answ) => {
          if (!answ) throw 'Invalid password bro'
          resolve(u.authenticate(knex))
        });
    })
  }

  authenticate(knex) {
    return knex('sessions')
      .returning('token')
      .insert({
        email: this.email,
        token: uuid.v4()
      })
  }

  static findBySessionToken(knex, token) {
    return knex('sessions')
      .where({token: token})
      .then((sessions) => {
        if (sessions.length === 0) throw 'No session found'
        const s = sessions[0]
        return knex('users').where({email: s.email}).select('uuid', 'email')
      })
  }

  static findByEmail(knex, email) {
    return knex('users')
      .where({email: email})
  }

  static getGoals(knex, uuid) {
    console.log('euuu')
    return knex('goals')
      .where({owner: uuid})
  }

  static setGoalAsDone(knex, uuid, goalUuid) {
    return knex('goals')
      .where({uuid: goalUuid})
      .update({completed_at: new Date()})
  }

}

module.exports = User