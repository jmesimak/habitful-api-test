//During the test the env variable is set to test
process.env.NODE_ENV = 'development';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
var knexConfig = require('../config')[process.env.NODE_ENV].knex
var knex = require('knex')(knexConfig);

chai.use(chaiHttp);

describe('Users', () => {

  before((done) => { 
    knex
      .raw('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
      .then(() => knex.migrate.latest())
      .then(() => done())
  });

  describe('User creation', () => {

    it('it should be able to create an user', (done) => {
      chai.request(server)
      .post('/users')
      .send({
        email: 'admin@bar.fi',
        password: 'foobar'
      })
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });

    it('Should be able to create a new session', (done) => {
      chai.request(server)
        .post('/users/sessions')
        .send({
          email: 'admin@bar.fi',
          password: 'foobar'
        })
        .end((err, res) => {
          res.body.should.have.property('token');
          done();
        });
    });

  });

  after((done) => {
    knex
      .raw('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
      .then(() => knex.migrate.latest())
      .then(() => done())
  })

});

describe('Habits', () => {

  let token;
  let habit;
  let instanceTime = new Date();

  before((done) => {
    chai.request(server)
      .post('/users')
      .send({
        email: 'admin@bar.fi',
        password: 'foobar'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('Should be able to create a habit', (done) => {
    chai.request(server)
      .post('/habits')
      .set('token', token)
      .send({
        name: 'One',
        type: 'Daily',
        goal: 5,
        description: 'Doit!'
      })
      .end((err, res) => {
        res.body.token.should.be.ok;
        done();
      })
  });

  it('Should be able to find the created habit', (done) => {
    chai.request(server)
      .get('/habits')
      .set('token', token)
      .end((err, res) => {
        res.body[0].name.should.equal('One');
        habit = res.body[0];
        done();
      });
  });

  it('Should be able to add instances for the created habit', (done) => {
    chai.request(server)
      .post(`/habits/${habit.uuid}/instance`)
      .set('token', token)
      .send({
        created_at: instanceTime
      })
      .end((err, res) => {
        res.status.should.equal(201);
        done();
      });
  });

  it('Should return the created habit along with the new instance', (done) => {
    chai.request(server)
      .get('/habits')
      .set('token', token)
      .end((err, res) => {
        res.body[0].instances.length.should.equal(1);
        done();
      });
  });

  it('Should be able to return the specific habit', (done) => {
    chai.request(server)
      .get(`/habits/${habit.uuid}`)
      .set('token', token)
      .end((err, res) => {
        res.body.name.should.equal('One');
        done();
      });
  });

  it('Should be able to delete the created instance', (done) => {
    chai.request(server)
      .delete(`/habits/${habit.uuid}/instances`)
      .set('token', token)
      .send({
        created_at: instanceTime
      })
      .end((err, res) => {
        res.body.message.should.equal('yup');
        done();
      });
  });


});