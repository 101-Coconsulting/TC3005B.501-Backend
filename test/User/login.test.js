import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';
import chaiHttp from 'chai-http';
import app from '../../index.js';

chai.use(chaiHttp);
should();

describe('/api/user/login', function () {
  it('Should return 200 for valid login credentials', function (done) {
    request.execute(app)
      .post('/api/user/login')
      .send({ username: 'testuser', password: 'testpassword' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('Should return 401 for invalid login credentials', function (done) {
    request.execute(app)
      .post('/api/user/login')
      .send({ username: 'invaliduser', password: 'wrongpassword' })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.have.property('error', 'Invalid username or password');
        done();
      });
  });

  it('Should return 400 for missing fields', function (done) {
    request.execute(app)
      .post('/api/user/login')
      .send({ username: 'testuser' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'Missing required fields');
        done();
      });
  });

  it('Should return 400 for empty fields', function (done) {
    request.execute(app)
      .post('/api/user/login')
      .send({ username: '', password: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'Missing required fields');
        done();
      });
  });
});
