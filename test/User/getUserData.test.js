import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';

import chaiHttp from 'chai-http';
import app from '../../index.js'

chai.use(chaiHttp);
should();

describe('/api/user/get-user-data/:user_id', function () {
  it('Should return 200 for valid user ID', function (done) {
    request.execute(app)
      .get('/api/user/get-user-data/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('user_id');
        res.body.should.have.property('user_name');
        res.body.should.have.property('email');
        res.body.should.have.property('phone_number');
        res.body.should.have.property('workstation');
        res.body.should.have.property('department_name');
        res.body.should.have.property('costs_center');
        res.body.should.have.property('creation_date');
        res.body.should.have.property('role_name');        
        done();
      })
  });

  it('Should return 400 for non-existent user ID', function (done) {
    request.execute(app)
      .get('/api/user/get-user-data/1000')
      .end((err, res) => {
      res.should.have.status(404);
      res.body.should.have.property('error', 'No information found for the user');
      done();
      })
  });

  it('Should return 400 for invalid user ID format', function(done) {
    request.execute(app)
    .get('/api/user/get-user-data/invalid')
    .end((err, res) => {
      res.should.have.status(400);
      res.body.should.have.property('error', 'At least one ID needs to be provided');
      done();
    });
  });
});