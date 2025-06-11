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
        res.body.should.be.an('object');
        res.body.should.have.property('user_id');
        done();
      });
  });

  it('Should return 404 for non-existent user ID', function (done) {
    request.execute(app)
      .get('/api/user/get-user-data/1000')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error', 'No information found for the user');
        done();
      });
  });

  it('Should return 400 for invalid user ID format', function (done) {
    request.execute(app)
      .get('/api/user/get-user-data/invalid')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error', 'Invalid user ID format');
        done();
      });
  });

  it('Should include the correct user data properties', function (done) {
    request.execute(app)
      .get('/api/user/get-user-data/1')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('user_id');
        expect(res.body).to.have.property('user_name');
        expect(res.body).to.have.property('email');
        expect(res.body).to.have.property('role_name');
        expect(res.body).to.have.property('department_name');
        expect(res.body).to.have.property('phone_number');
        done();
      });
  });
});

