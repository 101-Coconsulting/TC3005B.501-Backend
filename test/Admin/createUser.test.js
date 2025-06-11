import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/admin/create-user', function () {
  it('Should return 201 for valid user data', function (done) {
    const userData = {
      role_id: 1,
      department_id: 1,
      user_name: 'testuser',
      password: 'testpass123',
      workstation: 'testworkstation',
      email: 'test@example.com',
      phone_number: '1234567890'
    };

    request.execute(app)
      .post('/api/admin/create-user')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.should.have.property('message', 'User created succesfully');
        done();
      });
  });

  it('Should return 400 for missing required fields', function (done) {
    const userData = {
      role_id: 1,
      department_id: 1,
      password: 'testpass123',
      workstation: 'testworkstation',
      email: 'test@example.com'
    };

    request.execute(app)
      .post('/api/admin/create-user')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('errors');
        done();
      });
  });

  it('Should return 400 for invalid email format', function (done) {
    const userData = {
      role_id: 1,
      department_id: 1,
      user_name: 'testuser',
      password: 'testpass123',
      workstation: 'testworkstation',
      email: 'invalid-email',
      phone_number: '1234567890'
    };

    request.execute(app)
      .post('/api/admin/create-user')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('errors');
        done();
      });
  });

  it('Should return 400 for invalid role_id', function (done) {
    const userData = {
      role_id: 999, 
      department_id: 1,
      user_name: '',
      password: '',
      workstation: '',
      email: '',
      phone_number: ''
    };

    request.execute(app)
      .post('/api/admin/create-user')
      .send(userData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('errors');
        done();
      });
  });
});