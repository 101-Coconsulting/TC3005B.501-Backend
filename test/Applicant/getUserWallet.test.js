import * as chai from 'chai';
const { expect, should } = chai;
import { request } from 'chai-http';
import chaiHttp from 'chai-http';
import app from '../../index.js';

chai.use(chaiHttp);
should();

describe('/api/user/get-user-wallet/:user_id', function () {
  it('Should return 200 for valid user ID', function (done) {
    request.execute(app)
      .get('/api/user/get-user-wallet/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('user_id');
        res.body.should.have.property('user_name');
        res.body.should.have.property('wallet');
        done();
      });
  });

  it('Should return 404 for non-existent user ID', function (done) {
    request.execute(app)
      .get('/api/user/get-user-wallet/1000')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('error');
        done();
      });
  });

  it('Should return 400 for invalid user ID format', function (done) {
    request.execute(app)
      .get('/api/user/get-user-wallet/invalid')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('error');
        done();
      });
  });
}); 